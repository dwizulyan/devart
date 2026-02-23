import { ChildProcess, execFile, spawn } from "child_process";
import * as cl from "@clack/prompts";
import { setTimeout } from "timers/promises";



async function callLogin() {
    try {

        return new Promise<void>((resolve, reject) => {
            const spin = cl.spinner();
            spin.start("Starting Login...")
            setTimeout(500)
            const server = spawn(process.execPath, ["./node_modules/tsx/dist/cli.mjs", "./src/fncs/login.ts"], { stdio: ["inherit", "pipe", "inherit"] })
            server.stdout.on("data", async (data) => {
                const indicator: string = data.toString()
                spin.message("Success starting server")
                await setTimeout(500)
                spin.message("Awaiting user's action")
                if (indicator.includes("running")) {
                    await cl.text({ message: `Copy this link : https://www.deviantart.com/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000/callback&scope=browse` })
                }
                if (indicator.includes("Done")) {
                    server.kill()
                }
            })
            server.on("error", (err) => {
                spin.stop(err.toString())
                reject();
            })
            server.on("close", () => {
                spin.stop("Login success, closing server")
                resolve()
            })
        })

    }
    catch (err) {
        throw err
    }
}
export { callLogin }