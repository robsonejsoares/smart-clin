import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string()
        .min(3, { message: "O nome não pode ter números ou caracteres especiais e deve ter no mínimo três letras." })
        .regex(/^[A-Za-zÀ-ÿ\s]+$/, {}),
    address: z.string().optional(),
    phone: z.string()
        .regex(/^[0-9()+\s-]*$/, { message: "O telefone deve conter apenas números inteiros." })
        .optional(),
    status: z.string(),
    timeZone: z.string().min(1, { message: "O fuso horário é obrigatório." }),
})

type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm() {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            address: "",
            phone: "",
            status: "",
            timeZone: "",
        },
    })
}

