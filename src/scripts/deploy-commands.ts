import "dotenv/config";
import { deployCommandsGlobal } from "../utils/commandManager/deploy-commands";

( async () => {
  await deployCommandsGlobal();
})();