import { config } from "dotenv";
import circle from "./seeker.js";
config();

async function main() {
  await circle();
  setInterval(async () => {
    if (!(await circle())) {
      circle();
    }
  }, 14400000);
}
main();
