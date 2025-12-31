import fs from "fs";
import path from "path";

const HASH_FILE = path.resolve(".commands-hash");

export function getDeployedHash(): string | null {
    try {
        return fs.readFileSync(HASH_FILE, "utf8").trim();
    } catch {
        return null;
    }
}

export function setDeployedHash(hash: string) {
    fs.writeFileSync(HASH_FILE, hash, "utf8");
}