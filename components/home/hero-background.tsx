import Image from "next/image";

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-[#020812]">
      <Image
        src="/images/hero-bg.png"
        alt="AI logistika — futuristik yuk mashinasi va shahar"
        fill
        priority
        className="object-cover object-[60%_center] opacity-45"
        sizes="100vw"
      />
      {/* Dark overlay to give superb contrast to the text on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#020812] via-[#020812]/80 to-transparent" />
      {/* Smooth transition from the hero section to the services section */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020812] via-transparent to-[#020812]/30" />
      
      {/* Ambient background glow dots (futuristic feel) */}
      <div className="absolute top-[20%] left-[10%] h-[350px] w-[350px] rounded-full bg-[#00d4ff]/10 blur-[130px] animate-pulse-glow" />
      <div className="absolute bottom-[10%] right-[20%] h-[300px] w-[300px] rounded-full bg-[#6366f1]/10 blur-[100px]" />
    </div>
  );
}
