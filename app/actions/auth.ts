"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const team = formData.get("team") as string;
  
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
  const avatar = `https://ui-avatars.com/api/?name=${name}&background=random`;

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      team,
      avatar,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, { httpOnly: true, secure: true });

  return { success: true, user: { id: user.id, name: user.name, team: user.team, avatar: user.avatar } };
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

  return { success: true, user: { id: user.id, name: user.name, team: user.team, avatar: user.avatar } };
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
    select: { id: true, name: true, team: true, avatar: true },
  });

  return user;
}
