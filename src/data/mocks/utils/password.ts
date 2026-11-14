const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const fromHex = (value: string) =>
  Uint8Array.from(
    value.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? [],
  );

export const hashPassword = async (password: string, saltHex?: string) => {
  const salt = saltHex
    ? fromHex(saltHex)
    : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 600_000, hash: "SHA-256" },
    key,
    256,
  );

  return {
    passwordHash: toHex(new Uint8Array(bits)),
    passwordSalt: toHex(salt),
  };
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
  passwordSalt: string,
) => {
  const { passwordHash: hash } = await hashPassword(password, passwordSalt);
  return hash === passwordHash;
};
