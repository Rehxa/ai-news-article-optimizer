import { Suspense } from "react";
import Signup from "@/screens/register/register_page.jsx";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </Suspense>
  );
}
