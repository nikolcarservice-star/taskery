import { Prisma } from "@/generated/prisma/client";
import { isAppLocale, LOCALE_COOKIE } from "@/lib/i18n/config";
import { parseInterfaceLanguage } from "@/lib/i18n/user-locale";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { validatePassword } from "@/lib/password-policy";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getRegistrationBoostFields } from "@/lib/taskboost-promotion";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function registrationErrorMessage(error: unknown): {
  message: string;
  status: number;
} {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P1001" || error.code === "P1000") {
      return {
        message:
          "База данных недоступна. Запустите PostgreSQL: docker compose up -d",
        status: 503,
      };
    }
    if (error.code === "P2021") {
      return {
        message:
          "Таблицы не созданы. Выполните в терминале: npm run db:push",
        status: 503,
      };
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      message:
        "Не удалось подключиться к базе данных. Проверьте DATABASE_URL и запущен ли PostgreSQL.",
      status: 503,
    };
  }

  return { message: "Не удалось создать аккаунт", status: 500 };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`register:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return rateLimitResponse(limited.retryAfterSec);
  }

  try {
    const body = await request.json();
    const { email, password, name, role } = body as {
      email?: string;
      password?: string;
      name?: string;
      role?: "FREELANCER" | "CLIENT";
    };

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Укажите email, пароль и роль" },
        { status: 400 },
      );
    }

    if (!["FREELANCER", "CLIENT"].includes(role)) {
      return NextResponse.json({ error: "Некорректная роль" }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
    const interfaceLanguage =
      cookieLocale && isAppLocale(cookieLocale)
        ? cookieLocale
        : undefined;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? null,
        role,
        ...(interfaceLanguage ? { interfaceLanguage } : {}),
        ...(role === "FREELANCER"
          ? {
              freelancerProfile: { create: {} },
              ...getRegistrationBoostFields(),
            }
          : {}),
      },
    });

    await sendWelcomeEmail(user.email, user.name);

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("[register]", error);
    const { message, status } = registrationErrorMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}
