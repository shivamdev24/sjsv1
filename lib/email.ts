import "server-only";
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 465);
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;
const from = process.env.EMAIL_FROM;

function createTransporter() {
  if (!host || !user || !password || !from) {
    throw new Error("SMTP environment variables are missing.");
  }

  if (![465, 587].includes(port)) {
    throw new Error("SMTP_PORT must be 465 or 587.");
  }

  const secureSetting = process.env.SMTP_SECURE;
  const secure = secureSetting ? secureSetting === "true" : port === 465;

  if (secure && port !== 465) {
    throw new Error("Use SMTP port 465 for implicit TLS.");
  }

  if (!secure && port !== 587) {
    throw new Error("Use SMTP port 587 for STARTTLS.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
  });
}

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string,
) {
  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error("APP_URL is not configured.");
  }

  const expectedOrigin = new URL(appUrl).origin;
  const actualUrl = new URL(verificationUrl);

  if (actualUrl.origin !== expectedOrigin) {
    throw new Error("Verification URL has an unexpected origin.");
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from,
    to: email,
    subject: "Verify your SJS account",
    text: [
      "Welcome to SJS!",
      "",
      "Verify your email address using this link:",
      verificationUrl,
      "",
      "This link expires in 24 hours.",
      "If you did not create this account, ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h2>Verify your SJS account</h2>
        <p>Confirm your email address to finish setting up your account.</p>
        <p>
          <a
            href="${verificationUrl}"
            style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:6px"
          >
            Verify email
          </a>
        </p>
        <p>This link expires in 24 hours.</p>
        <p>If you did not create this account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error("APP_URL is not configured.");
  }

  const expectedOrigin = new URL(appUrl).origin;
  const actualUrl = new URL(resetUrl);

  if (actualUrl.origin !== expectedOrigin) {
    throw new Error("Password reset URL has an unexpected origin.");
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your SJS password",
    text: [
      "We received a request to reset your SJS account password.",
      "",
      "Use this link to reset your password:",
      resetUrl,
      "",
      "This link expires in 1 hour.",
      "If you did not request a password reset, ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h2>Reset your SJS password</h2>
        <p>We received a request to reset your account password.</p>
        <p>
          <a
            href="${resetUrl}"
            style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:6px"
          >
            Reset password
          </a>
        </p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request a password reset, ignore this email.</p>
      </div>
    `,
  });
}
