import { FeatureCard }
  from "@/components/FeatureCard";
import { AppHeader }
  from "@/components/AppHeader";
export default function Home() {
  return (
    <main>

      <AppHeader />
      
      <FeatureCard
        title="Object Detection"
        description="ตรวจจับวัตถุจากรูปภาพด้วย AI"
      />
      <br></br>
      <FeatureCard
        title="AI Chat"
        description="สนทนากบั Generative AI"
      />
      <button>
        Start Detection
      </button>
    </main>

  );

}

