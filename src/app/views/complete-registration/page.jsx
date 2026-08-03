import { Suspense } from "react";
import CompleteRegistrationPage from "@/screens/complete_register/complete_registration_page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteRegistrationPage />
    </Suspense>
  );
}
