import { Link } from "react-router-dom";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 md:px-12">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 group hover:cursor-pointer"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">TrueAI</span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer">
              Log In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:cursor-pointer">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </div>
    </header>
  );
}
