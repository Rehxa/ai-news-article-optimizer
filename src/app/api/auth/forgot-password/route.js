import { adminAuth } from "@/lib/firebase/admin";
import { sendPasswordResetEmail } from "@/lib/email/send_password_reset_email";

export async function POST(request) {
  const { email } = await request.json();

  try {
    const link = await adminAuth.generatePasswordResetLink(email);
    const url = new URL(link);
    const oobCode = url.searchParams.get("oobCode");

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/views/reset_password?oobCode=${oobCode}`;

    await sendPasswordResetEmail(email, resetUrl);
  } catch (error) {
    // Don't leak whether the email exists — log server-side, respond success either way
    console.error("forgot-password error:", error.code, error.message);
  }

  return Response.json({ success: true });
}
