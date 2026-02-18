import { select, text } from "@clack/prompts";
import { refreshToken } from "./refresh-token.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

import * as cl from "@clack/prompts"
import { getDeviations } from "./fetch.js";
import { batch } from "./download.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



async function greetings() {
    await text({
        message: `Current working directory : ${process.cwd()}`
    })
    await refreshToken();
    const chooses = await select({
        message: "What you wanted to do ?",
        options: [
            { value: "login", label: "Login" },
            { value: "refresh", label: "Refresh Login" },
            { value: "download", label: "Download Deviations" },
            { value: "update", label: "Update Downloaded Deviations" },
        ],
    })
    switch (chooses) {
        case "login":
            cl.log.info("Logging in...")
        case "refresh":
            await text({ message: "Refreshing Login Info...." })
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
                    await batch(userName as string);
            }
    }
}
export { greetings }