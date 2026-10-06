import { addDays } from "date-fns"

// Algoritmo de Meeus/Jones/Butcher para a data da Páscoa
function easterSunday(year: number) {
    const a = year % 19
    const b = Math.floor(year / 100)
    const c = year % 100
    const d = Math.floor(b / 4)
    const e = b % 4
    const f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4)
    const k = c % 4
    const l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const month = Math.floor((h + l - 7 * m + 114) / 31)
    const day = ((h + l - 7 * m + 114) % 31) + 1
    return new Date(year, month - 1, day)
}

function key(date: Date) {
    return `${date.getMonth() + 1}-${date.getDate()}`
}

const cache = new Map<number, Map<string, string>>()

function holidaysOfYear(year: number) {
    const cached = cache.get(year)
    if (cached) return cached

    const easter = easterSunday(year)
    const map = new Map<string, string>([
        ["1-1", "Confraternização Universal"],
        ["4-21", "Tiradentes"],
        ["5-1", "Dia do Trabalhador"],
        ["9-7", "Independência do Brasil"],
        ["10-12", "Nossa Senhora Aparecida"],
        ["11-2", "Finados"],
        ["11-15", "Proclamação da República"],
        ["11-20", "Dia da Consciência Negra"],
        ["12-25", "Natal"],
        [key(addDays(easter, -48)), "Carnaval"],
        [key(addDays(easter, -47)), "Carnaval"],
        [key(addDays(easter, -2)), "Sexta-feira Santa"],
        [key(easter), "Páscoa"],
        [key(addDays(easter, 60)), "Corpus Christi"],
    ])

    cache.set(year, map)
    return map
}

export function getHolidayName(date: Date): string | undefined {
    return holidaysOfYear(date.getFullYear()).get(key(date))
}
