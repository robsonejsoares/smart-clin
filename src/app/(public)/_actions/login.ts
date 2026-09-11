"use server"

import { signIn } from "@/lib/auth";

export async function handRegister(provider: string){
    await signIn(provider, { redirectTo: "/dashboard" });
}