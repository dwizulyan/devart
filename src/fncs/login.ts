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


const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

const server = serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    cl.log.info(`Server is running on http://localhost:${info.port}`)
    cl.log.info(`click this url to auth : https://www.deviantart.com/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000/callback&scope=browse`)
})

app.get("/callback", async (c) => {
    try {
        const CLIENT_ID = process.env.CLIENT_ID;
        const CLIENT_SECRET = process.env.CLIENT_SECRET;
        const REDIRECT_URI = process.env.REDIRECT_URI;
        const { code } = c.req.query();

        const req = await fetch(`https://www.deviantart.com/oauth2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`)
        const res = await req.json()
        await writeFile(path.join(__dirname, "./data/code.txt"), JSON.stringify({
            res
        }))
        cl.log.info("Done with auth, run this : npm run fetch")
        server.close(() => process.exit(0))
        return c.html(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Done</title>
  </head>
  <body>
    <p>
      Done with authorization, now go to folder and open terminal then type npm
      run fetch.
    </p>
  </body>
</html>
`)

    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
        }
    }
})

