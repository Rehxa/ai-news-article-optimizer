import crypto from "node:crypto";

const EXPIRY_MS = 1000 * 60 * 60 * 24;

function getSecret() {
  const secret = process.env.EMAIL_VERIFY_SECRET;

  if (!secret) {
    throw new Error("EMAIL_VERIFY_SECRET is not defined");
  }

  return secret;
}

export function createVerificationToken(email) {
  const secret = getSecret();

  const payload = {
    email,
    exp: Date.now() + EXPIRY_MS,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");

  const sig = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("base64url");

  return `${payloadStr}.${sig}`;
}

export function verifyToken(token) {
  const secret = getSecret();

  const [payloadStr, sig] = token.split(".");

  if (!payloadStr || !sig) {
    throw new Error("Malformed token");
  }

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("base64url");

  if (sig !== expectedSig) {
    throw new Error("Invalid token");
  }

  const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString());

  if (Date.now() > payload.exp) {
    throw new Error("Token expired");
  }

  return payload;
}
