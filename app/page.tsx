import { DetectionPanel }
 from "@/components/DetectionPanel";
import { FeatureCard }
  from "@/components/FeatureCard";
import { AppHeader }
  from "@/components/AppHeader";
export default function Home() {
  return (
    <main>

      <AppHeader />
      <br></br>
      <FeatureCard
        title="Object Detection"
        description="ตรวจจับวัตถุจากรูปภาพด้วย AI"
      />
      <br></br>
      <FeatureCard
        title="AI Chat"
        description="สนทนากับ Generative AI"
      />
      <br></br>
      <DetectionPanel/>
    </main>
    
  );

}

