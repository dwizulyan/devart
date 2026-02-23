import "dotenv/config";
import { log, tasks, spinner, settings } from "@clack/prompts"
import { readFile, writeFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url";
import { dirname } from "path";
import type { AuthReponse, Unsuccessfull } from "../types/auth.js";
import { getCode } from "../utils/get-code.js";
import { setTimeout } from "timers/promises";
import { isAuthResponse } from "../utils/type-guard.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const spin = spinner();
async function refreshToken(token: AuthReponse | Unsuccessfull) {
    try {
        spin.message("Attempting to refresh token...")
        await setTimeout(500)
        if (!isAuthResponse(token)) {
            throw Error("Failed to test token")
        }
        const refresh = await fetch(`https://www.deviantart.com/oauth2/token?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${token.res.refresh_token}`)
        const responseRefresh = await refresh.json()
        if (responseRefresh.status != "success") {
            spin.stop("Refreshing failed, try login")
            await setTimeout(500)
        }

        await writeFile(path.join(__dirname, "../data/code.txt"), JSON.stringify({ res: responseRefresh }))
        spin.stop("Successfully refresh token, happy downloading 😄")
    }
    catch (err) {
        throw err
    }
}
export { refreshToken }