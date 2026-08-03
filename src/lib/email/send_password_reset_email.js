import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendPasswordResetEmail(email, resetUrl) {
  const { data, error } = await resend.emails.send({
    from: "Kiripost News <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }
}
