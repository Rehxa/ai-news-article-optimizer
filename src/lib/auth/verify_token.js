import crypto from "crypto";

const SECRET = process.env.EMAIL_VERIFY_SECRET;
if (!SECRET) {
  throw new Error("EMAIL_VERIFY_SECRET is not defined");
}
const EXPIRY_MS = 1000 * 60 * 60 * 24;

export function createVerificationToken(email) {
  const payload = {
    email,
    exp: Date.now() + EXPIRY_MS,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payloadStr)
    .digest("base64url");
  return `${payloadStr}.${sig}`;
}

export function verifyToken(token) {
  const [payloadStr, sig] = token.split(".");
  if (!payloadStr || !sig) throw new Error("Malformed token");

  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(payloadStr)
    .digest("base64url");
  if (sig !== expectedSig) throw new Error("Invalid token");

  const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString());
  if (Date.now() > payload.exp) throw new Error("Token expired");

  return payload;
}
