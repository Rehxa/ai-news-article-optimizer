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
          {/* Decorative diagonal stripes - top left of the panel */}
          {/* <div
            className="pointer-events-none absolute -left-[10%] -top-[12%] h-40 w-64 z-0"
            aria-hidden="true"
          >
            <span className="absolute left-0 top-0 h-[254px] w-[12px] -rotate-[66deg] bg-primary-blue z-0" />
            <span className="absolute left-[110px] top-[13px] h-[254px] w-[25px] -rotate-[66deg] bg-primary-blue z-0" />
            <span className="absolute left-[237px] top-[38px] h-[254px] w-[12px] -rotate-[66deg] bg-primary-blue z-0" />
          </div> */}

          {/* Decorative diagonal stripes - bottom right of the panel */}
          {/* <div
            className="pointer-events-none absolute -bottom-[7%] -right-[10%] h-40 w-64 z-0"
            aria-hidden="true"
          >
            <span className="absolute bottom-0 right-0 h-[254px] w-[12px] -rotate-[66deg] bg-primary-blue" />
            <span className="absolute bottom-[13px] right-[110px] h-[254px] w-[25px] -rotate-[66deg] bg-primary-blue" />
            <span className="absolute bottom-[38px] right-[237px] h-[254px] w-[12px] -rotate-[66deg] bg-primary-blue" />
          </div> */}

          {/* Form */}
          {children}
        </div>
      </div>
    </div>
  );
}
