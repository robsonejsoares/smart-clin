"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UseProfileFormProps {
    name: string | null;
    address: string | null;
    phone: string | null;
    status: boolean;
    timeZone: string | null;
}

const profileSchema = z.object({
    name: z.string()
        .min(3, { message: "O campo nome é obrigatório e não pode ficar em branco." })
        .regex(/^[A-Za-zÀ-ÿ\s]+$/, {}),
    address: z.string().optional(),
    phone: z.string()
        .regex(/^[0-9()+\s-]*$/, { message: "O telefone deve conter apenas números inteiros." })
        .optional(),
    status: z.string(),
    timeZone: z.string().min(1, { message: "O fuso horário é obrigatório." }),
})

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({ name, address, phone, status, timeZone }:
    UseProfileFormProps) {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            name: name || "",
            address: address || "",
            phone: phone || "",
            status: status ? "active" : "inactive",
            timeZone: timeZone || "",
        },
    })
}
