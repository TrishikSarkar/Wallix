import Image from "next/image";
import wallixLogo from "../../images/wallix_logo.png";

export function Header() {
  return (
    <header className="flex w-full flex-col items-center pt-6 pb-6 max-md:pt-4 max-md:pb-4">
      <Image
        src={wallixLogo}
        alt="Wallix"
        className="w-[180px] sm:w-[210px] lg:w-[250px] max-md:w-[140px] h-auto"
        priority
      />
      <span className="mt-3 text-[15px] font-medium tracking-[0.28em] text-[#6b7280] max-md:text-[12px] max-md:tracking-[0.2em] max-md:mt-2">
        CREATE YOUR MINIMALIST WALLPAPER
      </span>
    </header>
  );
}
