/**
 * Verifica se uma data é hoje.
 * @param date A data a ser verificada.
 * @returns true se a data for hoje, false caso contrário.
 */
export function isToday(date: Date) {
    const now = new Date();

    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    )
}

/**
 * Verifica se um slot de horário está no passado.
 * @param slot O slot de horário a ser verificado.
 * @returns true se o slot estiver no passado, false caso contrário.
 */
export function isSlotInThePast(slotTime: string) {
    const [slotHour, slotMinute] = slotTime.split(":").map(Number)

    const now = new Date()
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (slotHour < currentHour) {
        return true;
    } else if (slotHour === currentHour && slotMinute <= currentMinute) {
        return true;
    }

    return false;

}
