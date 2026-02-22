import "dotenv/config";
import * as cl from "@clack/prompts"



import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { writeFile } from 'fs/promises'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export { __dirname }
import config from "../../config.json" with {type: "json"}


const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})
app.get("/callback", async (c) => {
    try {
        const CLIENT_ID = process.env.CLIENT_ID;
        const CLIENT_SECRET = process.env.CLIENT_SECRET;
        const REDIRECT_URI = process.env.REDIRECT_URI;
        const { code } = c.req.query();

        const req = await fetch(`https://www.deviantart.com/oauth2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`)
        const res = await req.json()
        await writeFile(path.join(config.codeLocation, "code.txt"), JSON.stringify({ res: res }))
        console.log("Done with auth, run this : npm run fetch")
        return c.text("Done with auth, run this : npm run fetch")

    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err)
        }
    }
})



serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server running on http://localhost:${info.port}`)
})

