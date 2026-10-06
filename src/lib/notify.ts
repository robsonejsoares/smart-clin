export type NoticeTone = "primary" | "danger" | "warning" | "orange";
export type NoticeIcon =
    | "check" | "trash" | "calendar-check" | "calendar-x" | "bell" | "bell-off"
    | "stethoscope" | "user-check" | "alert" | "x-circle" | "mail-warning" | "lock";

export interface Notice {
    id: number;
    title: string;
    message: string;
    tone: NoticeTone;
    icon: NoticeIcon;
}

type Kind = "success" | "error" | "warning" | "info";

interface Rule { test: RegExp; kinds?: Kind[]; title: string; tone?: NoticeTone; icon: NoticeIcon }

// Cada mensagem do sistema ganha título, ícone e cor próprios. Excluir/cancelar = vermelho.
const RULES: Rule[] = [
    { test: /não pode ser excluído/i, title: "Exclusão bloqueada", tone: "orange", icon: "lock" },
    { test: /e-mail/i, kinds: ["warning", "error"], title: "E-mail não enviado", tone: "orange", icon: "mail-warning" },
    { test: /lembrete.*exclu/i, kinds: ["success"], title: "Lembrete excluído", tone: "danger", icon: "bell-off" },
    { test: /lembrete.*cadastrado/i, kinds: ["success"], title: "Lembrete cadastrado", tone: "warning", icon: "bell" },
    { test: /serviço.*exclu/i, kinds: ["success"], title: "Serviço excluído", tone: "danger", icon: "trash" },
    { test: /serviço.*cadastrado/i, kinds: ["success"], title: "Serviço cadastrado", icon: "stethoscope" },
    { test: /serviço.*atualizado/i, kinds: ["success"], title: "Serviço atualizado", icon: "stethoscope" },
    { test: /agendamento cancelado/i, kinds: ["success"], title: "Agendamento cancelado", tone: "danger", icon: "calendar-x" },
    { test: /agendamento.*(criado|confirmado)/i, kinds: ["success"], title: "Agendamento criado", icon: "calendar-check" },
    { test: /alteração realizada/i, kinds: ["success"], title: "Perfil atualizado", icon: "user-check" },
    { test: /horário.*não está disponível/i, kinds: ["error", "warning"], title: "Horário indisponível", tone: "orange", icon: "calendar-x" },
    { test: /duração mínima/i, kinds: ["error", "warning"], title: "Duração inválida", tone: "orange", icon: "alert" },
    { test: /obrigatóri/i, kinds: ["error", "warning"], title: "Campo obrigatório", tone: "orange", icon: "alert" },
    { test: /não autenticado|não encontrado/i, kinds: ["error", "warning"], title: "Acesso negado", icon: "lock" },
];

const FALLBACK: Record<Kind, { title: string; tone: NoticeTone; icon: NoticeIcon }> = {
    success: { title: "Tudo certo!", tone: "primary", icon: "check" },
    info: { title: "Aviso", tone: "primary", icon: "alert" },
    warning: { title: "Atenção", tone: "orange", icon: "alert" },
    error: { title: "Algo deu errado", tone: "danger", icon: "x-circle" },
};

let current: Notice | null = null;
let counter = 0;
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

export function subscribeNotice(l: () => void) {
    listeners.add(l);
    return () => { listeners.delete(l); };
}
export function getNotice() { return current; }
export function dismissNotice() { current = null; emit(); }

function show(kind: Kind, message?: string) {
    const text = message ?? "";
    const rule = RULES.find((r) => r.test.test(text) && (!r.kinds || r.kinds.includes(kind)));
    const base = FALLBACK[kind];
    current = {
        id: ++counter,
        title: rule?.title ?? base.title,
        tone: rule?.tone ?? base.tone,
        icon: rule?.icon ?? base.icon,
        message: text,
    };
    emit();
}

export const toast = Object.assign((message?: string) => show("info", message), {
    success: (message?: string) => show("success", message),
    error: (message?: string) => show("error", message),
    warning: (message?: string) => show("warning", message),
    info: (message?: string) => show("info", message),
});
