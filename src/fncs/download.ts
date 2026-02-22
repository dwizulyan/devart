import { createWriteStream, } from "fs"
import { pipeline } from "stream/promises"
import path from "path"
import { mkdir, readFile } from "fs/promises"

import { Readable, Transform } from "stream"
import { type ReadableStream, } from "stream/web"
import type { Deviation } from "../types/deviation.js"

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { access } from "fs/promises"
import config from "../../config.json" with {type: "json"}

import * as cl from "@clack/prompts"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





function sanitizeFileName(name: string) {
    return name.replace(/[\\\/:*?"<>|]/g, "-");
}
function cutDecimal(num: number, digits: number) {
    const factor = 10 ** digits;
    return Math.trunc(num * factor) / factor;
}

async function download(data: Deviation, spin: cl.SpinnerResult, user: string) {
    try {
        if (!data) {
            throw new Error("no data found");
        }
        if (!data.content) {
            throw new Error("No content available")
        }
        const url = data.content.src
        const size = data.content.filesize / 1024 / 1024
        const get = await fetch(url)
        const fileExt = url.split("/")[5].split("?")[0].split(".")[1]
        let downloadedBytes = 0;
        const startTime = Date.now()
        if (!get.body) {
            throw new Error(`Error : ${get.statusText}`)
        }

        const progressStream = new Transform({
            transform(chunk: Buffer, _enc, cb) {
                downloadedBytes += chunk.length;

                const mb = downloadedBytes / 1024 / 1024;
                const displayMb = cutDecimal(mb, 2);

                const elapsed = (Date.now() - startTime) / 1000;
                const speed = cutDecimal(mb / elapsed, 2);

                // process.stdout.write(
                //     `\rDownloaded: ${displayMb} MB | Speed: ${speed} MB/s`
                // );
                spin.message(
                    `${data.title}, Downloaded: ${displayMb} MB | Speed: ${speed} MB/s`
                );

                cb(null, chunk); // 🔑 WAJIB diteruskan
            }
        });
        // console.log(`Downloading : ${sanitizeFileName(data.deviationid)} (${cutDecimal(size, 2)} Mb)`)
        spin.message(`Downloading ${data.title} : ${data.deviationid} (${cutDecimal(size, 2)} Mb)`)
        const downloadPath = path.join(`${config.downloadLocation}`, `${user}`, `${data.deviationid}.${fileExt}`)
        await pipeline(Readable.fromWeb(get.body as ReadableStream), progressStream, createWriteStream(downloadPath))
    }
    catch (err) {
        console.log(err)
    }
}

async function batch(user: string) {
    const imgs: { user: string, deviations: Deviation[] } = JSON.parse(await readFile(path.join(config.dbLocation, `${user}.txt`), { encoding: "utf-8" }))
    const spin = cl.spinner();
    try {
        spin.message(`Checking dir : ${path.join(config.downloadLocation, user)}`)
        await access(path.join(config.downloadLocation, user))
    }
    catch (err) {
        spin.message("Directory doesn't exist")
        spin.message("Creating directory")
        await mkdir(path.join(config.downloadLocation, user))
    }

    spin.start(`Downloading ${user}'s gallery`)
    for (let img of imgs.deviations) {
        await download(img, spin, user)
    }
    spin.stop(`Done`)
}
export { batch }