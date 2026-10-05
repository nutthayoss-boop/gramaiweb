import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { FeatureCard } from "@/components/FeatureCard";
import { DetectionPanel } from "@/components/DetectionPanel";
import { ApiStatus } from "@/components/ApiStatus";

export default function Home() {
  return (
    <main className="rd-shell">
      <AppHeader />
      <div className="rd-grid">
        <FeatureCard icon="🚗" title="Object Detection" description="ตรวจจับวัตถุจากรูปภาพด้วย AI" />
        <FeatureCard icon="💬" title="AI Chat" description="สนทนากับ Generative AI" />
        <FeatureCard icon="🧠" title="AIE" description="วิศวกรรมปัญญาประดิษฐ์ประยุกต์" />
      </div>
      <DetectionPanel />
      <section className="rd-card rd-row">
        <div>
          <h2>Saved Prompts</h2>
          <p>บันทึกและจัดการ prompt ที่ใช้บ่อยสำหรับแอป AI ของคุณ</p>
        </div>
        <Link href="/saved-prompts" className="rd-link">
          เปิด Saved Prompts
        </Link>
      </section>
      <ApiStatus />
    </main>
  );
}