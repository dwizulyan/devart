import { greetings } from "./fncs/greetings.js";

async function main() {
  await greetings()
}

(async () => {
  main();
})()