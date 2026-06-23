import { Secret, TOTP } from "otpauth";

const ISSUER = "Taskery";
const DIGITS = 6;
const PERIOD = 30;

export function generateTotpSecret(): string {
  return new Secret({ size: 20 }).base32;
}

export function buildTotpUri(email: string, secretBase32: string): string {
  const totp = new TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: DIGITS,
    period: PERIOD,
    secret: Secret.fromBase32(secretBase32),
  });
  return totp.toString();
}

export function verifyTotpCode(secretBase32: string, code: string): boolean {
  const trimmed = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(trimmed)) return false;

  const totp = new TOTP({
    algorithm: "SHA1",
    digits: DIGITS,
    period: PERIOD,
    secret: Secret.fromBase32(secretBase32),
  });

  return totp.validate({ token: trimmed, window: 1 }) !== null;
}
