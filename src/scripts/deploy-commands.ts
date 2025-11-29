import "dotenv/config";
import { deployCommandsGlobal } from "../utils/deploy-commands";

( async () => {
  await deployCommandsGlobal();
})();