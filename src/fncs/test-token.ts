import * as cl from "@clack/prompts"
import { setTimeout } from "timers/promises"
import type { AuthReponse, Unsuccessfull } from "../types/auth.js"
import { getCode } from "../utils/get-code.js"
import { access } from "fs/promises"
import path from "path"
import config from "../../config.json" with {type: "json"}



async function testToken(): Promise<{ success: boolean, data: AuthReponse | Unsuccessfull | null, next: "refresh" | "login" | null }> {
    try {
        const spin = cl.spinner()
        spin.start("Checking Token")
        await setTimeout(500)
        spin.message("Checking token")
        await setTimeout(500)
        const code: AuthReponse | Unsuccessfull = await getCode();
        if (!code.res) {
            spin.stop("Token Doesn't Exists, try login")
            return { success: false, data: null, next: "login" }
        }
        spin.message("Testing token")
        await setTimeout(500)
        const testToken = await fetch(`https://www.deviantart.com/api/v1/oauth2/placebo?access_token=${code.res.access_token}`)
        const resultToken = await testToken.json();
        if (resultToken.status != 'success') {
            spin.stop("Token Invalid")
            return { success: false, data: code, next: "refresh" }
        }
        spin.stop("Token Valid")
        return { success: true, data: code, next: null }

    }
    catch (err) {
        throw err
    }
}
export { testToken }