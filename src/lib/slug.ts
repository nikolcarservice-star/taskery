import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  ґ: "g",
  є: "e",
  і: "i",
  ї: "yi",
};

export function transliterate(text: string): string {
  return [...text.toLowerCase()].map((char) => CYRILLIC_TO_LATIN[char] ?? char).join("");
}

export function normalizeProjectSlugParam(value: string): string {
  let normalized = value.trim();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (!/%[0-9A-F]{2}/i.test(normalized)) {
      break;
    }

    try {
      normalized = decodeURIComponent(normalized);
    } catch {
      break;
    }
  }

  return normalized.normalize("NFC");
}

export function slugify(text: string): string {
  const base = transliterate(text)
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return base || "project";
}

export function hasNonAsciiSlug(slug: string): boolean {
  return /[^\x00-\x7F]/.test(slug);
}

export function getProjectPath(project: { id: string; slug: string }): string {
  if (hasNonAsciiSlug(project.slug)) {
    return `/projects/${project.id}`;
  }

  return `/projects/${project.slug}`;
}

export async function generateUniqueProjectSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let attempt = 0;

  while (await exists(slug)) {
    attempt += 1;
    slug = `${base}-${nanoid()}`;
    if (attempt > 10) {
      slug = `${base}-${Date.now()}`;
      break;
    }
  }

  return slug;
}

export function isFeaturedActive(featuredUntil: Date | null, isFeatured: boolean): boolean {
  if (!isFeatured) return false;
  if (!featuredUntil) return true;
  return featuredUntil > new Date();
}

export function isProUser(
  plan: string,
  featuredUntil: Date | null,
): boolean {
  const now = new Date();

  if (plan === "PRO") {
    if (featuredUntil && featuredUntil <= now) {
      return false;
    }
    return true;
  }

  return isFeaturedActive(featuredUntil, true);
}
