import { Header } from "@/components/header";
import { PreviewCard } from "@/components/preview-card";
import { ControlsCard } from "@/components/controls-card";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white max-xl:overflow-y-auto">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-start gap-6 px-6 min-h-0 max-xl:flex-col max-xl:items-center max-xl:gap-4 max-xl:px-4 max-xl:pb-6 max-xl:flex-none">
        <div className="flex-1 min-h-0 max-xl:w-full max-xl:max-w-[900px]">
          <PreviewCard />
        </div>
        <div className="shrink-0 min-h-0 max-xl:w-full max-xl:max-w-[900px]">
          <ControlsCard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
