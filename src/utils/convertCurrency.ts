/**
 * Converte um valor monetário em reais (BRL) para centavos.
 *
 * @param amount - O valor monetário em reais no formato brasileiro.
 * @returns O valor convertido em centavos.
 * @example
 * convertRealToCents("1.234,56"); // retorna 123456
 */

export function convertRealToCents(amount: string) {
    const numericPrice = parseFloat(amount.replace(/\./g, "").replace(",", "."));
    const priceInCents = Math.round(numericPrice * 100);

    return priceInCents;
}