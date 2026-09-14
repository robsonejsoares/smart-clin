"use server"

import prisma from "@/lib/prisma";

interface GetUserDatProps {
    userId: string;
}

export async function getUserData({ userId }: GetUserDatProps) {
    try {
        if (!userId) {
            return null;
        }

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            },
            include: {
                subscription: true,
            }
        });

        if (!user) {
            return user;
        }

        return user;

    } catch (error) {
        console.log(error);
        return null;
    }
}
