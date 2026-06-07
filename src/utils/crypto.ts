import { randomBytes, createHash } from "node:crypto";

export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<Boolean> {
  return await Bun.password.verify(password, hash);
}

export async function generateApiKey() {
  const raw = randomBytes(32).toString("base64");
  const hash = createHash("sha256").update(raw).digest("hex");
  const prefix = raw.slice(0, 8);
  return { raw, hash, prefix };
}
