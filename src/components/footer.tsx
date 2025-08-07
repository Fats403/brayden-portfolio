import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="w-full mt-10 text-xs text-muted-foreground">
      <Separator className="mb-6" />
      <div className="flex items-center justify-between">
        <span>© {new Date().getFullYear()} Brayden Blackwell</span>
        <a className="hover:text-foreground transition-colors" href="#hero">
          Back to top
        </a>
      </div>
    </footer>
  );
}
