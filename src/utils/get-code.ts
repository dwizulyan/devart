import type { AuthReponse, Unsuccessfull } from "../types/auth.js"
import { readFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url";
import { dirname } from "path";
import config from "../../config.json" with {type: "json"}

import { isAuthResponse } from "./type-guard.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getCode() {
    try {
        const auth: AuthReponse | Unsuccessfull = JSON.parse(await readFile(path.join(config.codeLocation, "code.txt"), { encoding: "utf-8" }))
        if (!isAuthResponse(auth)) {
            throw new Error("Not an AuthResponse")
        }
        return auth

    }
    catch (err) {
        throw err
    }
}
export { getCode }