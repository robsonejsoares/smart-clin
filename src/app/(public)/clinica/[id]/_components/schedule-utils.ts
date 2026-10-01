
export function isToday(date: Date) {
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

/**
 * Verificar se determinado slot já passou.
 */
export function isSlotInThePast(slotTime: string) {
  const [slotHour, slotMinute] = slotTime.split(":").map(Number)

  const now = new Date()
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (slotHour < currentHour) {
    return true; // true quer dize que a hora já passou
  } else if (slotHour === currentHour && slotMinute <= currentMinute) {
    return true;
  }

  return false;

}

/**
 * Verifica se uma sequência de slots está disponível.
 * @param startSlot O primeiro slot da sequência
 * @param requiredSlots A quantidade de slots necessários
 * @param allSlots Todos os slots disponíveis
 * @param blockedSlots Os slots bloqueados
 * @returns true se a sequência estiver disponível, false caso contrário
 */
export function isSlotSequenceAvailable(
  startSlot: string,
  requiredSlots: number,
  allSlots: string[],
  blockedSlots: string[]
) {

  const startIndex = allSlots.indexOf(startSlot)
  if (startIndex === -1 || startIndex + requiredSlots > allSlots.length) {
    return false;
  }


  for (let i = startIndex; i < startIndex + requiredSlots; i++) {
    const slotTime = allSlots[i]

    if (blockedSlots.includes(slotTime)) {
      return false;
    }
  }

  return true;
}