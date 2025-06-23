export default function CloudBackdrop() {
  return (
    <div
      className="
        absolute inset-0 -z-10 overflow-hidden
        theme-glass:block hidden
        animate-floatClouds
        bg-gradient-to-br from-[#e0f7fa] via-[#ffffff88] to-[#e0f7fa]
      "
    >
      <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-white/10 blur-3xl rounded-full animate-pulseCloud" />
      <div className="absolute bottom-[15%] right-[10%] w-[30rem] h-[30rem] bg-white/5 blur-2xl rounded-full animate-pulseCloud delay-1000" />
      <div className="absolute top-[40%] left-[60%] w-80 h-80 bg-white/10 blur-[90px] rounded-full animate-pulseCloud delay-2000" />
    </div>
  )
}
