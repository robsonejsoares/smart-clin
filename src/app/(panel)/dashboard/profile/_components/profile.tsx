"use client"
import AgendaLoader from "@/components/agenda-loader"
import { wait } from "@/lib/min-delay"

import {
    ProfileFormData,
    useProfileForm,
} from "./profile-form"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { cn } from "cn"
import Image from "next/image"
import { toast } from "@/lib/notify"
import { useState } from "react"

import {
    Info,
    Phone,
    Check,
    Clock3,
    MapPin,
    UserRound,
    ArrowRight,
} from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPhone } from "@/lib/formatPhone"
import { Prisma } from "@/generated/prisma/client"
import { updateProfile } from "../_actions/update-profile"
import imgTest from "../../../../../../public/logo-smart-clin.png"
import { DialogClinicHours } from "./dialogs/dialog-clinic-hours"

type UserWithSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true;
    };
}>

interface ProfileContentProps {
    user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {
    const [selectedHours, setSelectedHours] = useState<string[]>(
        (user.times ?? []).filter((time) => time <= "21:30")
    )

    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const form = useProfileForm({
        name: user.name,
        address: user.address,
        phone: user.phone,
        status: user.status,
        timeZone: user.timeZone,
    })

    function generateTimeSlots(): string[] {
        const hours: string[] = []

        for (let i = 8; i <= 21; i++) {
            for (let j = 0; j < 2; j++) {
                const hour = i.toString().padStart(2, "0")
                const minute = (j * 30).toString().padStart(2, "0")

                hours.push(`${hour}:${minute}`)
            }
        }

        return hours
    }

    const hours = generateTimeSlots()

    function toggleHour(hour: string) {
        setSelectedHours(prev =>
            prev.includes(hour)
                ? prev.filter(h => h !== hour)
                : [...prev, hour].sort()
        )
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
        "America/Noronha",
    ]

    const timeZones = Intl.supportedValuesOf("timeZone").filter(zone =>
        brazilianTimeZones.includes(zone)
    )

    async function onSubmit(values: ProfileFormData) {
        const response = await updateProfile({
            name: values.name,
            address: values.address,
            status: values.status === "active",
            phone: values.phone,
            timeZone: values.timeZone,
            times: selectedHours || [],
        })

        await wait()

        if (!response.success) {
            toast.error(response.message)
            return
        }

        toast.success(response.message)
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-3">
            <Card className="group relative overflow-hidden border-border/60 bg-background/95 shadow-lg shadow-black/[0.04]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
                >
                    <div className="smartclin-profile-line-top h-full bg-gradient-to-r from-emerald-400 via-[#252579] to-violet-500 blur-[0.5px]" />
                </div>

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px"
                >
                    <div className="smartclin-profile-line-bottom ml-auto h-full bg-gradient-to-l from-emerald-400 via-[#252579] to-violet-500 blur-[0.5px]" />
                </div>

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(16,185,129,0.075),transparent_30%),radial-gradient(circle_at_8%_100%,rgba(37,37,121,0.055),transparent_34%),linear-gradient(135deg,rgba(16,185,129,0.025),transparent_42%,rgba(37,37,121,0.025))]"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/[0.055] blur-3xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-32 left-1/3 h-48 w-48 rounded-full bg-[#252579]/[0.045] blur-3xl"
                />

                <CardHeader className="relative z-10 flex flex-row items-center justify-between gap-5 space-y-0 px-5 py-5 md:px-6">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                            <span
                                aria-hidden="true"
                                className="relative flex h-2.5 w-2.5 shrink-0"
                            >
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />

                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.28)]" />
                            </span>

                            <span className="text-[11px] font-semibold tracking-[0.04em] text-emerald-700/80">
                                Painel de
                            </span>
                        </div>

                        <CardTitle className="relative mt-2 w-fit max-w-full overflow-hidden text-2xl font-bold tracking-tight sm:text-3xl">
                            <span className="relative z-10 inline-block bg-gradient-to-r from-[#252579] via-[#10b981] to-[#252579] bg-[length:300%_100%] bg-[position:0%_50%] bg-clip-text text-transparent transition-[background-position] duration-1000 ease-out group-hover:bg-[position:100%_50%]">
                                Perfil
                            </span>

                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[1400ms] ease-out group-hover:left-[120%] group-hover:opacity-100"
                            />
                        </CardTitle>
                    </div>
                </CardHeader>
            </Card>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className="group relative overflow-hidden border-border/60 bg-background/95 shadow-lg shadow-black/[0.04]">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_5%,rgba(16,185,129,0.045),transparent_25%),radial-gradient(circle_at_5%_95%,rgba(37,37,121,0.035),transparent_30%)]"
                        />

                        {form.formState.isSubmitting && (
                            <div className="absolute inset-0 z-30 overflow-hidden bg-background px-5 py-8 sm:px-7 animate-in fade-in duration-200">
                                <div className="w-full">
                                    <AgendaLoader message="Salvando perfil..." rows={7} />
                                </div>
                            </div>
                        )}

                        <CardHeader className="relative z-10 border-b border-border/60 bg-gradient-to-br from-background via-background to-emerald-500/[0.02] px-5 py-5 sm:px-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover:scale-105 group-hover:border-[#252579]/20 group-hover:bg-[#252579]/[0.09] group-hover:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                                    <UserRound className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3" />
                                </div>

                                <div className="min-w-0">
                                    <CardTitle className="bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-clip-text text-base font-semibold tracking-tight text-transparent">
                                        Informações do Perfil
                                    </CardTitle>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="relative z-10 space-y-8 px-5 py-6 sm:px-7 sm:py-7">
                            <div className="flex flex-col items-center gap-3">
                                <div className="group/avatar relative h-32 w-32">
                                    <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#252579]/20 via-emerald-500/20 to-transparent opacity-60 blur-sm transition-opacity duration-500 group-hover/avatar:opacity-100" />

                                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-lg ring-1 ring-border/70 transition-[transform,box-shadow] duration-500 group-hover/avatar:scale-[1.025] group-hover/avatar:shadow-xl">
                                        <Image
                                            src={user.image ? user.image : imgTest}
                                            alt="Foto de perfil"
                                            fill
                                            sizes="128px"
                                            className="object-cover transition-transform duration-700 group-hover/avatar:scale-105"
                                        />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm font-semibold tracking-tight">
                                        Foto de perfil
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-foreground">
                                                Nome Completo
                                            </FormLabel>

                                            <FormControl>
                                                <div className="group/field relative">
                                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within/field:scale-105 group-focus-within/field:text-[#252579]" />

                                                    <Input
                                                        {...field}
                                                        className="h-11 pl-10"
                                                        placeholder="Digite o seu nome completo..."
                                                        onChange={event => {
                                                            const apenasLetras =
                                                                event.target.value.replace(
                                                                    /[^A-Za-zÀ-ÿ\s]/g,
                                                                    ""
                                                                )

                                                            field.onChange(
                                                                apenasLetras
                                                            )
                                                        }}
                                                    />
                                                </div>
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
                                            <FormLabel className="text-xs font-medium text-foreground">
                                                Endereço Completo
                                            </FormLabel>

                                            <FormControl>
                                                <div className="group/field relative">
                                                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within/field:scale-105 group-focus-within/field:text-[#252579]" />

                                                    <Input
                                                        {...field}
                                                        className="h-11 pl-10"
                                                        placeholder="Digite o seu endereço da clínica..."
                                                    />
                                                </div>
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
                                            <FormLabel className="text-xs font-medium text-foreground">
                                                Telefone
                                            </FormLabel>

                                            <FormControl>
                                                <div className="group/field relative">
                                                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within/field:scale-105 group-focus-within/field:text-[#252579]" />

                                                    <Input
                                                        {...field}
                                                        className="h-11 pl-10"
                                                        placeholder="(61) 99501-5804"
                                                        onChange={event => {
                                                            const formattedValue =
                                                                formatPhone(
                                                                    event.target.value
                                                                )

                                                            field.onChange(
                                                                formattedValue
                                                            )
                                                        }}
                                                    />
                                                </div>
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
                                            <FormLabel className="text-xs font-medium text-foreground">
                                                Status da Clínica
                                            </FormLabel>

                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="group/status h-11 cursor-pointer">
                                                        <SelectValue placeholder="Selecione o status da clínica..." />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem
                                                            value="active"
                                                            className="cursor-pointer"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.25)]" />
                                                                Ativa (clínica aberta)
                                                            </span>
                                                        </SelectItem>

                                                        <SelectItem
                                                            value="inactive"
                                                            className="cursor-pointer"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.25)]" />
                                                                Inativa (clínica fechada)
                                                            </span>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="timeZone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-foreground">
                                                Selecione o fuso horário
                                            </FormLabel>

                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="group/timezone h-11 cursor-pointer">
                                                        <SelectValue placeholder="Selecione o fuso horário..." />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {timeZones.map(zone => (
                                                            <SelectItem
                                                                key={zone}
                                                                value={zone}
                                                                className="cursor-pointer"
                                                            >
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

                                <div className="space-y-2 w-full">
                                    <label className="text-sm font-medium text-foreground">
                                        Configurar Horário de Funcionamento
                                    </label>

                                    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                                        <DialogTrigger asChild>
                                            <button
                                                type="button"
                                                className="group/button relative flex h-11 w-full cursor-pointer items-center justify-between rounded-md border border-border/70 bg-background px-3.5 text-left shadow-sm transition-all duration-200 hover:border-[#252579]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/30"
                                            >
                                                <span className="text-sm text-muted-foreground">
                                                    Clique aqui para selecionar o horário
                                                </span>
                                                <ArrowRight className="h-4 w-4 shrink-0 text-[#252579] transition-transform duration-300 group-hover/button:translate-x-1" />
                                            </button>
                                        </DialogTrigger>

                                        <DialogClinicHours
                                            isOpen={dialogIsOpen}
                                            onClose={() => setDialogIsOpen(false)}
                                            selectedHours={selectedHours}
                                            toggleHour={toggleHour}
                                            hours={hours}
                                        />
                                    </Dialog>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="group/save relative h-10 w-full cursor-pointer overflow-hidden rounded-md border border-[#252579]/40 bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-[length:200%_100%] bg-[position:0%_50%] font-semibold text-white shadow-[0_4px_16px_rgba(37,37,121,0.20)] transition-[background-position,border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-[#2d2d8f]/60 hover:bg-[position:100%_50%] hover:shadow-[0_8px_22px_rgba(37,37,121,0.28)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#252579]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[800ms] ease-out group-hover/save:left-[120%] group-hover/save:opacity-100"
                                />

                                <span className="relative z-10">
                                    Salvar Alterações
                                </span>
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Form>

            <style>{`
    .smartclin-profile-line-top,
    .smartclin-profile-line-bottom {
        width: 59%;
        opacity: 0.6;
        animation-duration: 10s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-fill-mode: both;
    }

    .smartclin-profile-line-top {
        animation-name: smartclin-profile-line-top;
    }

    .smartclin-profile-line-bottom {
        animation-name: smartclin-profile-line-bottom;
    }

    @keyframes smartclin-profile-line-top {
        0% {
            width: 59%;
        }

        50% {
            width: 92%;
        }

        100% {
            width: 59%;
        }
    }

    @keyframes smartclin-profile-line-bottom {
        0% {
            width: 59%;
        }

        50% {
            width: 92%;
        }

        100% {
            width: 59%;
        }
    }
`}</style>
        </div>
    )
}