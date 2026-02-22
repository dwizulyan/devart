import * as cl from "@clack/prompts"
import type { Deviation } from "../types/deviation.js"

async function update(oldData: Deviation[], newData: Deviation[]) {
    try {
        const outdated = new Map<string, null>();
        const update: Deviation[] = []
        oldData.map(data => {
            outdated.set(data.deviationid, null)
        })
        newData.map(data => {
            if (!outdated.has(data.deviationid)) {
                update.push(data)
            }
        })
        return update
    }
    catch (err) {
        throw err
    }
}
export { update }