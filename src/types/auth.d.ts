export type AuthReponse = {
    res: {
        expires_in: number,
        status: string,
        access_token: string,
        token_type: string,
        refresh_token: string,
        scope: string
    }
}
export type Unsuccessfull = {
    error: string,
    error_description: string
}