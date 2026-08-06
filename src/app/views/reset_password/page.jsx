import { Suspense } from "react";
import ResetPasswordPage from "@/screens/reset_password/reset_password_page";
import ResetPasswordPage2 from "@/screens/reset_password/reset_password2_page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage2 />
    </Suspense>
  );
}
