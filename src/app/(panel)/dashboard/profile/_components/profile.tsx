"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import { cn } from "cn"
import Image from "next/image"
import { useState } from "react"
import { Prisma } from "@/generated/prisma/client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import imgTest from "../../../../../../public/icone-criar-foto-perfil.webp"
import { ProfileFormData, useProfileForm } from "./profile-form"

type UserWithSubcription = Prisma.UserGetPayload<{
    include: {
        subscription: true;
    };
}>;

interface ProfileContentProps {
    user: UserWithSubcription;
}

export function ProfileContent({ user }: ProfileContentProps) {
    const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? []);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const form = useProfileForm({
        name: user.name,
        address: user.adress,
        phone: user.phone,
        status: user.status,
        timeZone: user.timeZone
    });

    function generateTimeSlots(): string[] {
        const hours: string[] = [];

        for (let i = 8; i <= 22; i++) {
            for (let j = 0; j < 2; j++) {

                const hour = i.toString().padStart(2, "0");
                const minute = (j * 30).toString().padStart(2, "0");
                hours.push(`${hour}:${minute}`);
            }
        }

        return hours;
    }

    const hours = generateTimeSlots();

    function toggleHour(hour: string) {
        setSelectedHours(prev => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort());
    }

    const brazilianTimeZones = [
        "America/Brasilia",
        "America/Sao_Paulo",
        "America/Fortaleza",
        "America/Recife",
        "America/Bahia",
        "America/Sao_Luis",
        "America/Belem",
        "America/Maceio",
        "America/Araguaina",
        "America/Campo_Grande",
        "America/Cuiaba",
        "America/Porto_Velho",
        "America/Boa_Vista",
        "America/Manaus",
        "America/Rio_Branco",
        "America/Noronha"
    ];

    const timeZones = Intl.supportedValuesOf("timeZone").filter((zone) =>
        brazilianTimeZones.includes(zone)
    );

    async function onSubmit(values: ProfileFormData) {
        const profileData = {
            ...values,
            times: selectedHours
        };
        console.log("Dados do formulário:", profileData);
    }

    return (
        <div className="mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Meu Perfil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-center">
                                <div className="relative w-40 h-40 rounded-full overflow-hidden">
                                    <Image
                                        src={user.image ? user.image : imgTest}
                                        alt="Foto de perfil"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">
                                                Nome Completo
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite o seu nome completo..."
                                                    onChange={(event) => {
                                                        const apenasLetras = event.target.value.replace(
                                                            /[^A-Za-zÀ-ÿ\s]/g,
                                                            ""
                                                        );
                                                        field.onChange(apenasLetras);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">
                                                Endereço Completo
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite o seu endereço da clínica..."
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">
                                                Telefone
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite o telefone..."
                                                    onChange={(event) => {
                                                        const apenasTelefone = event.target.value.replace(
                                                            /[^0-9()+\s-]/g,
                                                            ""
                                                        );
                                                        field.onChange(apenasTelefone);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">
                                                Status da Clínica
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue="active"
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status da clínica..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Ativa (clínica aberta)</SelectItem>
                                                        <SelectItem value="inactive">Inativa (clínica fechada)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <Label className="font-semibold">
                                        Configurar Horário de Funcionamento
                                    </Label>
                                    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between cursor-pointer">
                                                Clique aqui para selecionar o horário
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Horários da Clínica</DialogTitle>
                                                <DialogDescription>
                                                    Selecione os horários de funcionamento da clínica:
                                                </DialogDescription>
                                            </DialogHeader>
                                            <section className="py-4">

                                                {/* <p className="text-sm text-muted-foreground mb-2">
                                                    Clique nos horários abaixo para marcar ou desmarcar:
                                                </p> */}

                                                <div className="grid grid-cols-5 gap-2">
                                                    {hours.map((hour) => (
                                                        <Button
                                                            key={hour}
                                                            variant="outline"
                                                            className={cn("h-10 cursor-pointer", selectedHours.includes(hour) && "border-2 border-emerald-500 text-primary")}
                                                            onClick={() => toggleHour(hour)}
                                                        >
                                                            {hour}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </section>
                                            <Button
                                                className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-400"
                                                onClick={() => setDialogIsOpen(false)}
                                            >
                                                Fechar Modal
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="timeZone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">
                                                Selecione o fuso horário
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o fuso horário... " />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {timeZones.map((zone) => (
                                                            <SelectItem key={zone} value={zone} className="cursor-pointer">
                                                                {zone}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-400"
                                >
                                    Salvar Alterações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}