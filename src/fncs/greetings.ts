import { select, text } from "@clack/prompts";
import { refreshToken } from "./refresh-token.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
            await text({ message: "Logging in...." })
        case "refresh":
            await text({ message: "Refreshing Login Info...." })
        case "download":
            await text({ message: "Downloading...." })

    }
}
export { greetings }