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
  const appointmentDate = format(new Date(appointment.appointmentDate), "dd/MM/yyyy");

  const whatsappMessage = `Olá, ${appointment.name}! Tudo bem?\n\nEstamos entrando em contato para confirmar seu agendamento na SmartClin para o dia ${appointmentDate} às ${appointment.time}.`;

  const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <DialogContent className="sm:max-w-lg h-[520px] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-0 shadow-2xl backdrop-blur-xl">
      {/* 1. Cabeçalho (Fixo) */}
      <DialogHeader className="shrink-0 border-b border-border/60 bg-gradient-to-br from-background via-background to-[#252579]/[0.025] px-6 py-5">
        <div className="relative flex flex-col gap-0.5">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            Detalhes do agendamento
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Confira as informações deste atendimento.
          </DialogDescription>
        </div>
      </DialogHeader>

      {/* 2. Conteúdo Principal (Rolável e com Altura Preservada) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 p-6">
        
        {/* Grid Horário e Data */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Card 1: Horário */}
          <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-muted/[0.08] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#252579]/25 hover:bg-[#252579]/[0.025] hover:shadow-md">
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#252579]/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#252579]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#252579]/15 bg-[#252579]/[0.06] text-[#252579] transition-all duration-300 group-hover:scale-105 group-hover:border-[#252579]/25 group-hover:bg-[#252579]/[0.10] group-hover:shadow-xs">
                <Clock3 className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Horário
                </p>
                <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">
                  {appointment.time}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Data */}
          <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-muted/[0.08] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/25 hover:bg-violet-500/[0.025] hover:shadow-md">
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/[0.06] text-violet-600 transition-all duration-300 group-hover:scale-105 group-hover:border-violet-500/25 group-hover:bg-violet-500/[0.10] group-hover:shadow-xs">
                <CalendarDays className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Data
                </p>
                <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">
                  {appointmentDate}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Card 3: Paciente */}
        <section className="group relative overflow-hidden rounded-xl border border-border/60 bg-muted/[0.08] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#252579]/20 hover:bg-[#252579]/[0.015] hover:shadow-md">
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#252579]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#252579]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#252579]/15 bg-[#252579]/[0.06] text-[#252579] transition-all duration-300 group-hover:scale-105 group-hover:border-[#252579]/25 group-hover:bg-[#252579]/[0.10] group-hover:shadow-xs">
                <UserRound className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Paciente
                </p>
                <p className="truncate text-sm font-bold text-foreground">
                  {appointment.name}
                </p>
              </div>
            </div>

            <div className="pl-[52px] space-y-1.5 border-t border-border/40 pt-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/contact flex w-fit max-w-full items-center gap-2 rounded-md py-0.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600 transition-transform duration-200 group-hover/contact:scale-110" />
                <span className="font-medium">{appointment.phone}</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5 group-hover/contact:opacity-100" />
              </a>

              <a
                href={`mailto:${appointment.email}`}
                className="group/contact flex max-w-full items-center gap-2 rounded-md py-0.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-[#252579]"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#252579] transition-transform duration-200 group-hover/contact:scale-110" />
                <span className="break-all font-medium">{appointment.email}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Card 4: Serviço */}
        <section className="group relative overflow-hidden rounded-xl border border-border/60 bg-muted/[0.08] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/25 hover:bg-emerald-500/[0.015] hover:shadow-md">
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Ícone Padronizado (Fundo translúcido leve) */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/[0.08] text-emerald-600 transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-500/25 group-hover:bg-emerald-500/[0.12] group-hover:shadow-xs">
                  <Stethoscope className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Serviço
                  </p>
                  <p className="truncate text-sm font-bold text-foreground">
                    {appointment.Service.name}
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-base font-extrabold text-foreground tabular-nums">
                {formatCurrency(appointment.Service.price / 100)}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5">
              <span className="text-xs font-medium text-muted-foreground">Status do agendamento</span>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Agendado</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </DialogContent>
  );
}