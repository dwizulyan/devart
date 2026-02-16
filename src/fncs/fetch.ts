import { readFile, writeFile } from "fs/promises"
import path from "path"
import type { AuthReponse, Unsuccessfull } from "../types/auth.js";
import type { GalleryErrorResponse, GalleryResponse } from "../types/deviation.js";
import type { Deviation } from "../types/deviation.js";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { isAuthResponse, isGalleryResponse } from "../utils/type-guard.js";



const url = "https://www.deviantart.com/api/v1/oauth2/gallery/all"
async function get() {
    try {
        const auth: AuthReponse | Unsuccessfull = JSON.parse(await readFile(path.join(__dirname, "./data/code.txt"), { encoding: "utf-8" }))
        if (!isAuthResponse(auth)) {
            throw new Error("Error while fetching data")
        }
        const limit = 24;
        console.log("Fetching....")
        const req = await fetch(`${url}?username=kilugirl&limit=${limit}`, {
            headers: {
                "Authorization": `Bearer ${auth.res.access_token}`
            }
        })
        if (!req.ok) {
            throw new Error(req.statusText);
        }
        const res = await req.json();
        console.log(`Fetched : ${res.results.length} Images, Total : ${res.results.length}`)
        return res
    }
    catch (err) {
        console.log(err instanceof Error ? err.message : "Unknown Error");
    }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));



async function getDeviations(user: string) {
    try {
        const limit = 24;
        const result: Deviation[] = [];
        const auth: AuthReponse | Unsuccessfull = JSON.parse(await readFile(path.join(__dirname, "./data/code.txt"), { encoding: "utf-8" }));

        let imgs: GalleryResponse | GalleryErrorResponse = await get();


        if (!isGalleryResponse(imgs)) {
            throw new Error(imgs.error_descripton)
        }
        for (const item of imgs.results) {
            result.push(item);
        }

        while (isGalleryResponse(imgs) && imgs.has_more) {
            await sleep(2500);

            const req: Response = await fetch(
                `${url}?username=${user}&limit=${limit}&offset=${imgs.next_offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${isAuthResponse(auth) ? auth.res.access_token : ""}`
                    }
                }
            );
            if (!req.ok) {
                throw new Error(req.statusText);
            }

            imgs = await req.json(); // UPDATE imgs
            if (!isGalleryResponse(imgs)) {
                throw new Error(imgs.error_descripton)
            }
            for (const item of imgs.results) {
                result.push(item);
            }
            console.log(`Fetched : ${imgs.results.length > 0 ? `${imgs.results.length} Images` : "Done"}, Total : ${result.length}`)
        }
        await writeFile(path.join(__dirname, `./ data / ${user}.txt`), JSON.stringify({ user: user, deviatins: result }))
        return result.flat();

    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
}
export { getDeviations }