import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster position="top-center" />
      {children}
    </ThemeProvider>
  );
}
