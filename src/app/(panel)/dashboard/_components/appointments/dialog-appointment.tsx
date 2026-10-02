import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentWithService } from "./appointments-list";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  CalendarDays,
  Clock3,
  Mail,
  MessageCircle,
  UserRound,
  Stethoscope,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

interface DialogAppointmentProps {
  appointment: AppointmentWithService | null;
}

export function DialogAppointment({
  appointment,
}: DialogAppointmentProps) {
  if (!appointment) {
    return null;
  }

  const whatsappNumber = appointment.phone.replace(/\D/g, "");

  const appointmentDate = format(
    appointment.appointmentDate,
    "dd/MM/yyyy"
  );

  const whatsappMessage = `Olá, ${appointment.name}! Tudo bem?

Estamos entrando em contato para confirmar seu agendamento na SmartClin para o dia ${appointmentDate} às ${appointment.time}.`;

  const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <DialogContent className="overflow-hidden border border-border/50 bg-background/95 p-0 shadow-2xl shadow-black/15 backdrop-blur-2xl sm:max-w-lg">
      <DialogHeader className="relative overflow-hidden border-b border-border/50 px-6 pb-6 pt-6">
        <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="relative">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Detalhes do agendamento
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-sm text-muted-foreground">
            Confira as informações deste atendimento.
          </DialogDescription>
        </div>
      </DialogHeader>
      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="group relative overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 via-background to-background p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/70 hover:shadow-xl hover:shadow-blue-500/10 dark:border-blue-900/40 dark:from-blue-950/30 dark:hover:border-blue-800/60">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-500/15 group-hover:shadow-lg group-hover:shadow-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400">
                <Clock3 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tracking-tight">
                  Horário
                </p>
                <p className="mt-0.5 text-base text-muted-foreground">
                  {appointment.time}
                </p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 via-background to-background p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/70 hover:shadow-xl hover:shadow-violet-500/10 dark:border-violet-900/40 dark:from-violet-950/30 dark:hover:border-violet-800/60">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl transition-all duration-500 group-hover:bg-violet-500/20" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-violet-500/15 group-hover:shadow-lg group-hover:shadow-violet-500/20 dark:bg-violet-500/15 dark:text-violet-400">
                <CalendarDays className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tracking-tight">
                  Data
                </p>
                <p className="mt-0.5 text-base text-muted-foreground">
                  {appointmentDate}
                </p>
              </div>
            </div>
          </div>
        </div>
        <section className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-xl dark:hover:shadow-black/20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl transition-all duration-500 group-hover:bg-blue-500/10" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-blue-600 ring-1 ring-blue-500/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/10 dark:text-blue-400">
                <UserRound className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-base font-bold tracking-tight">
                Paciente
              </h3>
            </div>
            <div className="pl-[52px]">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 shrink-0 text-muted-foreground" />
                <p className="text-base text-muted-foreground">
                  {appointment.name}
                </p>
              </div>
              <div className="mt-3 space-y-1.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/contact flex w-fit max-w-full items-center gap-2 rounded-lg py-1 text-sm text-muted-foreground transition-all duration-200 hover:text-green-600 dark:hover:text-green-400"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-green-600 transition-transform duration-200 group-hover/contact:scale-110 dark:text-green-400" />
                  <span>{appointment.phone}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5 group-hover/contact:opacity-100" />
                </a>
                <a
                  href={`mailto:${appointment.email}`}
                  className="group/contact flex max-w-full items-center gap-2 rounded-lg py-1 text-sm text-muted-foreground transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Mail className="h-4 w-4 shrink-0 text-blue-600 transition-transform duration-200 group-hover/contact:scale-110 dark:text-blue-400" />
                  <span className="break-all">
                    {appointment.email}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="group relative overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-background to-violet-50/50 p-5 shadow-md shadow-blue-500/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/70 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-blue-900/40 dark:from-blue-950/30 dark:to-violet-950/20 dark:hover:border-blue-800/60">
          <div className="pointer-events-none absolute -bottom-20 -right-12 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />
          <div className="pointer-events-none absolute -left-14 -top-14 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl transition-all duration-500 group-hover:bg-violet-500/20" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-60" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-500/30">
                  <Stethoscope className="h-5 w-5 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110" />
                </div>
                <h3 className="text-base font-bold tracking-tight">
                  Serviço
                </h3>
              </div>
              <p className="shrink-0 text-lg font-bold tracking-tight">
                {formatCurrency(appointment.Service.price / 100)}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-border/40 pt-4">
              <p className="min-w-0 truncate pl-[52px] text-base text-muted-foreground">
                {appointment.Service.name}
              </p>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-600 ring-1 ring-green-500/20 transition-all duration-300 group-hover:bg-green-500/15 group-hover:ring-green-500/30 dark:text-green-400">
                <CheckCircle2 className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                <span>Agendado</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DialogContent>
  );
}