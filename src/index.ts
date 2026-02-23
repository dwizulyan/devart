import { greetings } from "./fncs/greetings.js";
import * as cl from "@clack/prompts"

async function main() {
  await greetings()
}

(async () => {
  try {
    main();
  }
  catch (err) {
    cl.log.error(err instanceof Error ? err.message : "Unknown Error")
  }
})()