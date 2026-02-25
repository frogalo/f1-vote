"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const username = (formData.get("username") as string) || name;
  const password = formData.get("password") as string;
  const teamName = formData.get("team") as string;
  const favoriteDriverSlug = formData.get("favoriteDriver") as string;

  if (!username || !password || !name) {
    return { error: "Brakujące wymagane pola" };
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return { error: "Nazwa użytkownika jest już zajęta" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Find Team and Driver IDs
  const team = await prisma.team.findUnique({ where: { name: teamName } });
  const driver = await prisma.driver.findUnique({ where: { slug: favoriteDriverSlug } });

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      teamId: team?.id,
      favoriteDriverId: driver?.slug,
      avatar: null, // "null first" as requested
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, { httpOnly: true, secure: true });

  return { success: true, user: { id: user.id, name: user.name } };
}

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Brak danych logowania" };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: "Nieprawidłowa nazwa użytkownika lub hasło" };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return { error: "Nieprawidłowa nazwa użytkownika lub hasło" };
  }

  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, { httpOnly: true, secure: true });

  return { success: true, user: { id: user.id, name: user.name, isAdmin: user.isAdmin } };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/login");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      avatar: true,
      team: { select: { name: true } },
      favoriteDriver: { select: { name: true, slug: true } }
    },
  });

  if (!user) return null;

  // Flatten for easier usage in components if expected
  return {
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
    avatar: user.avatar,
    team: user.team?.name || null,
    favoriteDriver: user.favoriteDriver?.name || null,
    favoriteDriverSlug: user.favoriteDriver?.slug || null,
  };
}

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { error: "Nie zalogowano" };

  const name = formData.get("name") as string;
  const teamName = formData.get("team") as string;
  const favoriteDriverSlug = formData.get("favoriteDriver") as string;

  if (!name?.trim()) {
    return { error: "Imię jest wymagane" };
  }

  // Resolve team ID from name
  let teamId: string | null = null;
  if (teamName) {
    const team = await prisma.team.findUnique({ where: { name: teamName } });
    teamId = team?.id || null;
  }

  // Resolve driver slug
  let driverSlug: string | null = null;
  if (favoriteDriverSlug) {
    const driver = await prisma.driver.findUnique({ where: { slug: favoriteDriverSlug } });
    driverSlug = driver?.slug || null;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name.trim(),
      teamId,
      favoriteDriverId: driverSlug,
    },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      avatar: true,
      team: { select: { name: true } },
      favoriteDriver: { select: { name: true, slug: true } },
    },
  });

  return {
    success: true,
    user: {
      id: updated.id,
      name: updated.name,
      isAdmin: updated.isAdmin,
      avatar: updated.avatar,
      team: updated.team?.name || null,
      favoriteDriver: updated.favoriteDriver?.name || null,
      favoriteDriverSlug: updated.favoriteDriver?.slug || null,
    },
  };
}
