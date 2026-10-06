import { NextResponse } from "next/server"
import { Resend } from "resend"

interface AppointmentConfirmation {
    name: string
    email: string
    date: string
    time: string
    service: string
    clinic: string
    address: string
}

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
}

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.EMAIL_FROM

    if (!apiKey || !from) {
        return NextResponse.json(
            { message: "E-mail não configurado. Defina RESEND_API_KEY e EMAIL_FROM." },
            { status: 503 }
        )
    }

    const body = (await request.json()) as Partial<AppointmentConfirmation>
    const requiredFields: (keyof AppointmentConfirmation)[] = [
        "name", "email", "date", "time", "service", "clinic",
    ]

    if (requiredFields.some((field) => !body[field])) {
        return NextResponse.json(
            { message: "Dados incompletos para enviar a confirmação." },
            { status: 400 }
        )
    }

    const resend = new Resend(apiKey)
    const name = escapeHtml(body.name!)
    const service = escapeHtml(body.service!)
    const date = escapeHtml(body.date!)
    const time = escapeHtml(body.time!)
    const clinic = escapeHtml(body.clinic!)
    const address = body.address ? escapeHtml(body.address) : ""
    const mapsUrl = body.address
        ? `https://maps.google.com/?q=${encodeURIComponent(body.address)}`
        : ""

    try {
        await resend.emails.send({
            from,
            to: body.email!,
            subject: "Confirmação de agendamento",
            html: `
                <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17172f">
                    <h2>Agendamento confirmado</h2>
                    <p>Olá, ${name}!</p>
                    <p>Seu agendamento foi confirmado com sucesso.</p>
                    <p>
                        <strong>Serviço:</strong> ${service}<br>
                        <strong>Data:</strong> ${date}<br>
                        <strong>Horário:</strong> ${time}<br>
                        <strong>Clínica:</strong> ${clinic}
                        ${address ? `<br><strong>Endereço:</strong> <a href="${mapsUrl}" style="color:#252579">${address}</a>` : ""}
                    </p>
                </div>
            `,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Erro ao enviar confirmação por e-mail:", error)
        return NextResponse.json(
            { message: "Não foi possível enviar o e-mail de confirmação." },
            { status: 502 }
        )
    }
}
