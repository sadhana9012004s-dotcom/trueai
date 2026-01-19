import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import { DashboardProvider } from "@/components/dashboard/DashboardProvider";

export default function DashboardLayout({ children }) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/", { replace: true });
    }
  }, [user, isLoaded, navigate]);

  if (!isLoaded || !user) return null;

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </DashboardProvider>
  );
}
