import { Resend } from "resend";
import { createVerificationToken } from "@/lib/auth/verify_token";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing");
}

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return Response.json(
      { error: "Email and display name are required" },
      { status: 400 },
    );
  }

  const token = createVerificationToken(email);
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/views/complete-registration?token=${token}`;

  await resend.emails.send({
    from: "Kiripost News <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email to complete registration",
    html: `<p>Hi user,</p><p>Click below to finish setting up your account:</p><p><a href="${link}">Complete registration</a></p><p>This link expires in 24 hours.</p>`,
  });

  return Response.json({ success: true });
}
