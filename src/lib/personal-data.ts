import {
  type PersonalDataForm,
  type UserLanguageRow,
} from "@/lib/personal-data-shared";
import { prisma } from "@/lib/prisma";

export async function getPersonalData(userId: string): Promise<PersonalDataForm> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      role: true,
      name: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      country: true,
      city: true,
      phone: true,
      avatar: true,
      languages: { orderBy: { language: "asc" } },
      freelancerProfile: {
        select: {
          wantsFreelanceProjects: true,
          wantsRemoteWork: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let firstName = user.firstName;
  let lastName = user.lastName;
  if (!firstName && user.name) {
    const parts = user.name.trim().split(/\s+/);
    firstName = parts[0] ?? null;
    lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;
  }

  const languages: UserLanguageRow[] = user.languages.map((item) => ({
    id: item.id,
    language: item.language,
    level: item.level,
  }));

  return {
    email: user.email,
    role: user.role,
    firstName,
    lastName,
    dateOfBirth: user.dateOfBirth
      ? user.dateOfBirth.toISOString().slice(0, 10)
      : null,
    country: user.country,
    city: user.city,
    phone: user.phone,
    avatar: user.avatar,
    wantsFreelanceProjects:
      user.freelancerProfile?.wantsFreelanceProjects ?? true,
    wantsRemoteWork: user.freelancerProfile?.wantsRemoteWork ?? false,
    languages,
  };
}
