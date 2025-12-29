import crypto from "crypto";

function sortObject(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(sortObject);
    }

    if (value && typeof value === "object") {
        return Object.keys(value)
            .sort()
            .reduce<Record<string, unknown>>((acc, key) => {
                acc[key] = sortObject((value as Record<string, unknown>)[key]);
                return acc;
            }, {});
    }

    return value;
}

export function hashCommand(commands: unknown): string {
    const sorted = sortObject(commands);
    const json = JSON.stringify(sorted);
    return crypto.createHash("sha256").update(json).digest("hex");
}