import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import LandingPage from "@/components/LandingPage";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      navigate("/app", { replace: true });
    }
  }, [user, isLoaded, navigate]);

  return (
    <div className="min-h-screen bg-background text-center text-foreground px-6">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
}
