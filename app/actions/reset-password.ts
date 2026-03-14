"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPassword(formData: FormData) {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!token || !password || !confirmPassword) {
        return { error: "Wszystkie pola są wymagane" };
    }

    if (password !== confirmPassword) {
        return { error: "Hasła nie są identyczne" };
    }

    if (password.length === 0) {
        return { error: "Hasło jest wymagane" };
    }

    try {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!resetToken) {
            return { error: "Nieważny lub nieistniejący token" };
        }

        if (resetToken.used) {
            return { error: "Ten link został już użyty" };
        }

        if (resetToken.expiresAt < new Date()) {
            return { error: "Ten link wygasł" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and mark token as used
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword }
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true }
            })
        ]);

        return { success: true };
    } catch (e: unknown) {
        return { error: "Wystąpił błąd podczas resetowania hasła" };
    }
}
