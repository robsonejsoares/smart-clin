export const MIN_LOADING_MS = 2500

export function wait(ms: number = MIN_LOADING_MS) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function withMinDelay<T>(task: Promise<T>, ms: number = MIN_LOADING_MS): Promise<T> {
    const [result] = await Promise.all([task, wait(ms)])
    return result
}
