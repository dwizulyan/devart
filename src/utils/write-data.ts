import type { Deviation } from "../types/deviation.js";
import { writeFile } from "fs/promises";
import config from "../../config.json" with {type: "json"}
import path from "path";

async function writeData(data: { user: string, deviations: Deviation[] }) {
    try {
        await writeFile(path.join(config.dbLocation, `${data.user}.txt`), JSON.stringify(data), { encoding: "utf-8" })
    }
    catch (err) {
        throw err
    }
}
export { writeData }