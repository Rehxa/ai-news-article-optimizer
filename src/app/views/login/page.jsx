import LoginPage from "@/screens/login/login_page";
import LoginPage2 from "@/screens/login/login2_page";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage2 />
    </Suspense>
  );
}
