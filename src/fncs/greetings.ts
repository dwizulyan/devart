import config from "../../config.json" with {type: "json"}

import { select, text } from "@clack/prompts";
import { refreshToken } from "./refresh-token.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { access, mkdir } from "fs/promises";
import { spawn } from "child_process";
import { setTimeout } from "timers/promises";

import * as cl from "@clack/prompts"
import { getDeviations } from "./fetch.js";
import { batch } from "./download.js";
import { update } from "./update.js";
import { writeFile } from "fs/promises";
import { getCode } from "../utils/get-code.js";
import type { AuthReponse, Unsuccessfull } from "../types/auth.js";
import { callLogin } from "./call-login.js";
import { testToken } from "./test-token.js";
import { resolveTxt } from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function greetings() {
    try {
        let running = true;
        await cl.tasks([
            {
                title: `Checking ${config.parentDir}`,
                task: async (message) => {
                    try {
                        await setTimeout(500)
                        message(`Checking  ${path.join(config.parentDir)}`)
                        await access(path.join(config.parentDir))
                        return `Directory ${path.join(config.parentDir)} Exists`
                    }
                    catch (err) {
                        await setTimeout(500)
                        message("Directory doesn't exists ")
                        message(`Creating directory ${path.join(config.parentDir)}`)
                        await mkdir(path.join(config.parentDir))
                        return `Successfully creating ${path.join(config.parentDir)}`
                    }
                }
            },
            {
                title: `Checking ${config.dbLocation}`,
                task: async (message) => {
                    try {
                        await setTimeout(500)
                        message(`Checking  ${path.join(config.dbLocation)}`)
                        await access(path.join(config.dbLocation))
                        return `Directory ${path.join(config.dbLocation)} Exists`
                    }
                    catch (err) {
                        await setTimeout(500)
                        message("Directory doesn't exists")
                        message(`Creating directory ${path.join(config.dbLocation)}`)
                        await mkdir(path.join(config.dbLocation))
                        return `Successfully creating ${path.join(config.dbLocation)}`
                    }
                }
            },
            {
                title: `Checking ${config.downloadLocation}`,
                task: async (message) => {
                    try {
                        await setTimeout(500)
                        message(`Checking  ${path.join(config.downloadLocation)}`)
                        await access(path.join(config.downloadLocation))
                        return `Directory ${path.join(config.downloadLocation)} Exists`
                    }
                    catch (err) {
                        await setTimeout(500)
                        message("Directory doesn't exists")
                        message(`Creating directory ${path.join(config.downloadLocation)}`)
                        await mkdir(path.join(config.downloadLocation))
                        return `Successfully creating ${path.join(config.downloadLocation)}`
                    }
                }
            },
            {
                title: `Checking ${config.codeLocation}`,
                task: async (message) => {
                    try {
                        await setTimeout(500)
                        message(`Checking  ${path.join(config.codeLocation)}`)
                        await access(path.join(config.codeLocation))
                        return `Directory ${path.join(config.codeLocation)} Exists`
                    }
                    catch (err) {
                        await setTimeout(500)
                        message("Directory doesn't exists ")
                        message(`Creating directory ${path.join(config.codeLocation)}`)
                        await mkdir(path.join(config.codeLocation))
                        return `Successfully creating ${path.join(config.codeLocation)}`
                    }
                }
            }, {
                title: `Checking ${path.join(config.codeLocation, "code.txt")}`,
                task: async (message) => {
                    try {
                        await setTimeout(500)
                        message(`Checking  ${path.join(config.codeLocation, "code.txt")}`)
                        await access(path.join(config.codeLocation, "code.txt"))
                        return `File ${path.join(config.codeLocation, "code.txt")} Exists`
                    }
                    catch (err) {
                        await setTimeout(500)
                        message("File doesn't exists ")
                        message(`Creating file ${path.join(config.codeLocation, "code.txt")}`)
                        await writeFile(path.join(config.codeLocation, "code.txt"), JSON.stringify({ res: null }))
                        return `Successfully creating ${path.join(config.codeLocation, "code.txt")}`
                    }
                }
            }
        ])
        // TODO : Create login function.
        const resTestToken = await testToken()
        if (!resTestToken.success && resTestToken.data != null && resTestToken.next === "refresh") {
            await refreshToken(resTestToken.data);
        }
        while (running) {
            const chooses = await select({
                message: "What you wanted to do ?",
                options: [
                    { value: "login", label: "Login" },
                    { value: "refresh", label: "Refresh Login" },
                    { value: "download", label: "Download Deviations" },
                    { value: "update", label: "Update Downloaded Deviations" },
                    { value: "exit", label: "Exit" },
                ],
            })
            switch (chooses) {
                case "exit":
                    running = false;
                    break;
                case "login":
                    cl.log.info("Logging in...")
                    await callLogin()
                    break
                case "refresh":
                    await text({ message: "Refreshing Login Info...." })
                    break
                case "download":
                    cl.log.info("Starting download menu...")
                    const downloadType = await cl.select({
                        message: "Which type of download you wanted to do ?",
                        options: [
                            { value: "gallery", label: "Users Gallery" },
                            { value: "single", label: "Single Image" }
                        ]
                    })
                    switch (downloadType) {
                        case "gallery":
                            const userName = await cl.text({
                                message: "Username of the gallery's owner",
                                placeholder: "e.g kilugirl"
                            })
                            await getDeviations(userName as string);
                            await setTimeout(500)
                            await batch(userName as string);

                    }
                    break;
                case "update":
                    cl.log.info("Starting update menu...")
                    break;
            }

        }

    }
    catch (err) {
        throw err
    }
}
export { greetings }