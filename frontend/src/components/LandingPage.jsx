import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight, Upload, Zap, FileCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center space-y-8 bg-background">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter sm:leading-[1.1]">
            Is it Real or AI? <br className="hidden md:block" />
            <span className="text-primary/80">Know the Truth Instantly.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
            The professional tool to detect AI-generated audio, video, and
            imagery. Secure, fast, and accurate analysis for everyone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <SignInButton mode="modal">
            <button className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 hover:cursor-pointer">
              Try It Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </SignInButton>
        </div>

        {/* Tech Stack / Trusted By simplified */}
        <div className="pt-12">
          <p className="text-sm text-muted-foreground mb-6">
            Supported Formats
          </p>
          <div className="flex gap-8 justify-center grayscale opacity-70">
            <span className="font-semibold">MP3</span>
            <span className="font-semibold">WAV</span>
            <span className="font-semibold">MP4</span>
            <span className="font-semibold">JPG</span>
            <span className="font-semibold">PNG</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-secondary/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="w-10 h-10" />}
              title="Easy Upload"
              desc="Drag & drop any media file. We support audio, video, and images up to 50MB."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Instant Analysis"
              desc="Our advanced AI models process your file in seconds, not minutes."
            />
            <FeatureCard
              icon={<FileCheck className="w-10 h-10" />}
              title="Detailed Reports"
              desc="Get a clear 'Real' or 'Fake' verdict with a confidence score and reasoning."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border shadow-sm">
      <div className="mb-4 p-3 bg-primary/5 rounded-full text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
