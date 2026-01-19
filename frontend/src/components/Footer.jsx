import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <h4 className="text-lg font-bold">TrueAI</h4>
          <p className="text-sm text-muted-foreground">
            © 2026 TrueAI Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary rounded-full"
    >
      {icon}
    </a>
  );
}
