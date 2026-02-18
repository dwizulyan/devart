import "dotenv/config";
import { log, tasks } from "@clack/prompts"
import { readFile, writeFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url";
import { dirname } from "path";
import type { AuthReponse, Unsuccessfull } from "../types/auth.js";
import { getCode } from "../utils/get-code.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



async function refreshToken() {
    try {
        await tasks([
            {
                title: "Checking token",
                task: async (message) => {
                    message("Checking token")
                    const code: AuthReponse | Unsuccessfull = await getCode();
                    message("Testing token")
                    const testToken = await fetch(`https://www.deviantart.com/api/v1/oauth2/placebo?access_token=${code.res.access_token}`)
                    const resultToken = await testToken.json();
                    if (resultToken.status != 'success') {
                        message("Attempting to refresh token...")
                        const refresh = await fetch(`https://www.deviantart.com/oauth2/token?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${code.res.refresh_token}`)
                        const responseRefresh = await refresh.json()
                        if (responseRefresh.status != "success") {
                            message("Refreshing failed, try login")
                        }

                        await writeFile(path.join(__dirname, "../data/code.txt"), JSON.stringify({ res: responseRefresh }))
                        message("Successfully refresh token, happy downloading 😄")
                    }
                    return "Token valid, happy downloading 😄"
                }

            }
        ])

    }
    catch (err) {
        log.error(err instanceof Error ? err.message : "Unknown Error")
    }
}
export { refreshToken }