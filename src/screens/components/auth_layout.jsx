export default function AuthLayout({ image, children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-natural-grey-blue">
      <div className="flex min-h-screen">
        {/* Left Side */}
        <div className="relative hidden flex-2 items-center justify-center lg:flex">
          {/* White diagonal background */}
          <div className="absolute left-[-35%] top-1/2 h-80 w-[180%] -translate-y-1 rotate-[28deg] bg-white" />

          <img
            src={image}
            alt="Login Illustration"
            className="relative z-10 w-[650px] max-w-[60%]"
          />
        </div>

        {/* Right Panel */}
        <div className="relative flex flex-1 w-full items-center justify-center bg-white px-8 py-9 shadow-[-15px_0_20px_rgba(0,0,0,0.15)] lg:w-[42rem] lg:rounded-l-4xl overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
