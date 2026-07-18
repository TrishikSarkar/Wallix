import Image from "next/image";
import wallixLogo from "../../images/wallix_logo.png";

export function Header() {
  return (
    <header className="flex w-full flex-col items-center pt-6 pb-6">
      <Image
        src={wallixLogo}
        alt="Wallix"
        className="w-[180px] sm:w-[210px] lg:w-[250px] h-auto"
        priority
      />
      <span className="mt-3 text-[15px] font-medium tracking-[0.28em] text-[#6b7280]">
        CREATE YOUR MINIMALIST WALLPAPER
      </span>
    </header>
  );
}
