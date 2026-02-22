import { readFile, writeFile } from "fs/promises"
import path, { resolve } from "path"
import type { AuthReponse, Unsuccessfull } from "../types/auth.js";
import type { GalleryErrorResponse, GalleryResponse } from "../types/deviation.js";
import type { Deviation } from "../types/deviation.js";

import * as cl from "@clack/prompts"


import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { isAuthResponse, isGalleryResponse } from "../utils/type-guard.js";
import { writeData } from "../utils/write-data.js";



const url = "https://www.deviantart.com/api/v1/oauth2/gallery/all"
async function get(user: string) {
    try {
        const auth: AuthReponse | Unsuccessfull = JSON.parse(await readFile(path.join(__dirname, "../data/code.txt"), { encoding: "utf-8" }))
        if (!isAuthResponse(auth)) {
            throw new Error("Error while fetching data")
        }
        const limit = 24;
        const req = await fetch(`${url}?username=${user}&limit=${limit}`, {
            headers: {
                "Authorization": `Bearer ${auth.res.access_token}`
            }
        })
        if (!req.ok) {
            throw new Error(req.statusText);
        }
        const res = await req.json();
        return res
    }
    catch (err) {
    }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));



async function getDeviations(user: string) {
    try {
        const spin = cl.spinner();
        spin.start("Fetching images by " + user)
        const limit = 24;
        const result: Deviation[] = [];
        const auth: AuthReponse | Unsuccessfull = JSON.parse(await readFile(path.join(__dirname, "../data/code.txt"), { encoding: "utf-8" }));

        let imgs: GalleryResponse | GalleryErrorResponse = await get(user);


        if (!isGalleryResponse(imgs)) {
            throw new Error(imgs.error_descripton)
        }
        for (const item of imgs.results) {
            result.push(item);
        }

        spin.message(`Fetched ${result.length} images`)
        while (isGalleryResponse(imgs) && imgs.has_more) {
            await sleep(1000);
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

            spin.message(`Fetched ${result.length} images`)
        }
        spin.stop(`Fetched : ${result.length} images`)
        cl.tasks([
            {
                title: `Writing fetched data`,
                task: async (message) => {
                    try {
                        message("Writing fetched data")
                        new Promise<void>((resolve) => {
                            setTimeout(async () => {
                            }, 1000);
                        })
                        await writeData({ user: user, deviations: result })

                        resolve()

                        return "Successfully writing data"
                    }
                    catch (err) {
                        return err instanceof Error ? err.message : "Unknown Error"
                    }
                }
            }

        ])
        return result.flat();

    } catch (err) {
        throw err
    }
}
export { getDeviations }