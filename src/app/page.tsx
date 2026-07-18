import { Header } from "@/components/header";
import { PreviewCard } from "@/components/preview-card";
import { ControlsCard } from "@/components/controls-card";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-start gap-6 px-6 min-h-0">
        <div className="flex-1 min-h-0">
          <PreviewCard />
        </div>
        <div className="shrink-0 min-h-0">
          <ControlsCard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
