import { Suspense } from "react";
import ResetPasswordPage from "@//screens/reset_password/reset_password_page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
