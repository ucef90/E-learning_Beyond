import {
  randomBytes,
  scrypt as derive,
  timingSafeEqual,
  createHash,
} from "node:crypto";
function scrypt(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    derive(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
}
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt-v1:${salt}:${(await scrypt(password, salt)).toString("hex")}`;
}
export async function verifyPassword(
  password: string,
  encoded?: string | null,
) {
  const [version, salt, hex] = (encoded || "").split(":");
  const actual = await scrypt(password, salt || "invalid-user-timing-salt");
  const expected = Buffer.from(hex || "00".repeat(64), "hex");
  return (
    version === "scrypt-v1" &&
    expected.length === actual.length &&
    timingSafeEqual(expected, actual)
  );
}
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
