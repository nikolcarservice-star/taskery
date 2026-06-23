import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { generateUniqueProjectSlug, slugify } from "../src/lib/slug";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const categories = [
  {
    name: "Веб-разработка",
    slug: "web-development",
    description: "Сайты, веб-приложения, интернет-магазины и SaaS на React, Next.js и других технологиях.",
  },
  {
    name: "Дизайн",
    slug: "design",
    description: "UI/UX, брендинг, макеты лендингов и мобильных приложений в Figma.",
  },
  {
    name: "Маркетинг",
    slug: "marketing",
    description: "SMM, контекстная реклама, SEO-продвижение и аналитика.",
  },
  {
    name: "Копирайтинг",
    slug: "copywriting",
    description: "Тексты для сайтов, блогов, рекламы и социальных сетей.",
  },
  {
    name: "Мобильная разработка",
    slug: "mobile-development",
    description: "iOS, Android и кроссплатформенные приложения.",
  },
];

const skills = [
  { name: "React", slug: "react", categorySlug: "web-development" },
  { name: "Next.js", slug: "nextjs", categorySlug: "web-development" },
  { name: "TypeScript", slug: "typescript", categorySlug: "web-development" },
  { name: "Figma", slug: "figma", categorySlug: "design" },
  { name: "UI/UX", slug: "ui-ux", categorySlug: "design" },
  { name: "SEO", slug: "seo", categorySlug: "marketing" },
  { name: "Node.js", slug: "nodejs", categorySlug: "web-development" },
  { name: "PostgreSQL", slug: "postgresql", categorySlug: "web-development" },
];

async function backfillProjectSlugs() {
  const projects = await prisma.project.findMany({
    where: { slug: "" },
    select: { id: true, title: true },
  });

  for (const project of projects) {
    const slug = await generateUniqueProjectSlug(project.title, async (s) => {
      const found = await prisma.project.findFirst({
        where: { slug: s, NOT: { id: project.id } },
      });
      return Boolean(found);
    });
    await prisma.project.update({
      where: { id: project.id },
      data: { slug },
    });
  }

  const withoutSlug = await prisma.project.findMany({
    select: { id: true, title: true, slug: true },
  });

  for (const project of withoutSlug) {
    if (!project.slug) {
      const slug = `${slugify(project.title)}-${project.id.slice(-6)}`;
      await prisma.project.update({
        where: { id: project.id },
        data: { slug },
      });
    }
  }
}

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
  }

  const categoryBySlug = Object.fromEntries(
    (
      await prisma.category.findMany({
        select: { id: true, slug: true },
      })
    ).map((category) => [category.slug, category.id]),
  );

  for (const skill of skills) {
    const categoryId = categoryBySlug[skill.categorySlug] ?? null;
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: { name: skill.name, categoryId },
      create: {
        name: skill.name,
        slug: skill.slug,
        categoryId,
      },
    });
  }

  const adminHash = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@taskery.local" },
    update: {
      passwordHash: adminHash,
      role: "ADMIN",
      name: "Администратор",
      adminPermissions: ["FULL_ACCESS"],
      adminActive: true,
    },
    create: {
      email: "admin@taskery.local",
      passwordHash: adminHash,
      role: "ADMIN",
      name: "Администратор",
      balance: 0,
      adminPermissions: ["FULL_ACCESS"],
      adminActive: true,
    },
  });

  await prisma.freelancerProfile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      title: "Администратор платформы",
    },
  });

  const demoPassword = await bcrypt.hash("demo12345", 12);
  const webCategory = await prisma.category.findUnique({
    where: { slug: "web-development" },
  });
  const reactSkill = await prisma.skill.findUnique({ where: { slug: "react" } });
  const nextSkill = await prisma.skill.findUnique({ where: { slug: "nextjs" } });
  const tsSkill = await prisma.skill.findUnique({
    where: { slug: "typescript" },
  });

  const demoClient = await prisma.user.upsert({
    where: { email: "client@taskery.local" },
    update: {
      passwordHash: demoPassword,
      name: "Олексій Коваленко",
      role: "CLIENT",
      bio: "Основатель IT-стартапа. Ищу надёжных исполнителей для веб-проектов и дизайна.",
      balance: 15000,
    },
    create: {
      email: "client@taskery.local",
      passwordHash: demoPassword,
      role: "CLIENT",
      name: "Олексій Коваленко",
      bio: "Основатель IT-стартапа. Ищу надёжных исполнителей для веб-проектов и дизайна.",
      balance: 15000,
    },
  });

  await prisma.project.upsert({
    where: { slug: "demo-landing-saas" },
    update: {
      title: "Лендинг для SaaS-стартапа",
      description:
        "Нужен современный одностраничный лендинг на Next.js с адаптивной вёрсткой, формой заявки и интеграцией аналитики. Есть готовый дизайн в Figma.",
      budget: 25000,
      status: "OPEN",
      categoryId: webCategory?.id,
    },
    create: {
      slug: "demo-landing-saas",
      clientId: demoClient.id,
      categoryId: webCategory?.id,
      title: "Лендинг для SaaS-стартапа",
      description:
        "Нужен современный одностраничный лендинг на Next.js с адаптивной вёрсткой, формой заявки и интеграцией аналитики. Есть готовый дизайн в Figma.",
      budget: 25000,
      currency: "UAH",
      status: "OPEN",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      viewsCount: 42,
    },
  });

  await prisma.project.upsert({
    where: { slug: "demo-admin-panel" },
    update: {
      title: "Админ-панель для CRM",
      description:
        "Разработка внутренней панели управления клиентами: таблицы, фильтры, экспорт в CSV, роли пользователей.",
      budget: 45000,
      status: "OPEN",
      categoryId: webCategory?.id,
    },
    create: {
      slug: "demo-admin-panel",
      clientId: demoClient.id,
      categoryId: webCategory?.id,
      title: "Админ-панель для CRM",
      description:
        "Разработка внутренней панели управления клиентами: таблицы, фильтры, экспорт в CSV, роли пользователей.",
      budget: 45000,
      currency: "UAH",
      status: "OPEN",
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      viewsCount: 18,
    },
  });

  const demoFreelancer = await prisma.user.upsert({
    where: { email: "freelancer@taskery.local" },
    update: {
      passwordHash: demoPassword,
      name: "Марія Шевченко",
      role: "FREELANCER",
      bio: "Full-stack разработчик с 5+ годами опыта. Специализируюсь на React, Next.js и TypeScript. Работаю с стартапами и средним бизнесом.",
      rating: 4.8,
      balance: 3200,
    },
    create: {
      email: "freelancer@taskery.local",
      passwordHash: demoPassword,
      role: "FREELANCER",
      name: "Марія Шевченко",
      bio: "Full-stack разработчик с 5+ годами опыта. Специализируюсь на React, Next.js и TypeScript. Работаю с стартапами и средним бизнесом.",
      rating: 4.8,
      balance: 3200,
    },
  });

  const freelancerProfile = await prisma.freelancerProfile.upsert({
    where: { userId: demoFreelancer.id },
    update: {
      title: "Full-stack разработчик",
      hourlyRate: 45,
      skills: {
        set: [reactSkill, nextSkill, tsSkill].filter(Boolean).map((s) => ({
          id: s!.id,
        })),
      },
    },
    create: {
      userId: demoFreelancer.id,
      title: "Full-stack разработчик",
      hourlyRate: 45,
      skills: {
        connect: [reactSkill, nextSkill, tsSkill]
          .filter(Boolean)
          .map((s) => ({ slug: s!.slug })),
      },
    },
  });

  await prisma.portfolioItem.deleteMany({
    where: { freelancerProfileId: freelancerProfile.id },
  });

  await prisma.portfolioItem.createMany({
    data: [
      {
        freelancerProfileId: freelancerProfile.id,
        title: "E-commerce на Next.js",
        description:
          "Интернет-магазин с корзиной, оплатой Stripe и админ-панелью. Время разработки — 6 недель.",
        projectUrl: "https://example.com",
      },
      {
        freelancerProfileId: freelancerProfile.id,
        title: "Дашборд аналитики",
        description:
          "SaaS-панель с графиками, real-time обновлениями и экспортом отчётов в PDF.",
        projectUrl: "https://example.com",
      },
    ],
  });

  console.log("\n✅ Seed completed.\n");
  console.log("Demo accounts (password for all: demo12345):");
  console.log("  Заказчик:   client@taskery.local");
  console.log("  Фрилансер:  freelancer@taskery.local");
  console.log("  Админ:      admin@taskery.local / admin123\n");

  await backfillProjectSlugs();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
