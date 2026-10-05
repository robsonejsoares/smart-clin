export type ActionResult<T = undefined> =
    | {
        success: true
        message?: string
        data?: T
    }
    | {
        success: false
        message: string
        data?: undefined
    }
