import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Footer() {
  return (
    <>
      <footer className="pt-12 text-center space-y-8 pb-10">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <Link href="#" className="hover:text-[var(--color-deep-purple)]">
            Bantuan
          </Link>
          <Link href="#" className="hover:text-[var(--color-deep-purple)]">
            Status
          </Link>
          <Link href="#" className="hover:text-[var(--color-deep-purple)]">
            Syarat
          </Link>
          <Link href="#" className="hover:text-[var(--color-deep-purple)]">
            Privasi
          </Link>
        </div>
        <div className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
          © {new Date().getFullYear()} DUKUNASIA • SPREADING LOVE{" "}
          <span className="text-purple-300">💜</span>
        </div>
      </footer>

      {/* <div className="fixed bottom-6 right-6 z-[100]">
        <Card className="p-4 max-w-[160px] flex flex-col items-center gap-3 shadow-xl">
          <p className="text-[10px] font-bold text-center text-slate-600">Butuh bantuan?</p>
          <div className="bg-[var(--color-pastel-purple)] p-2 rounded-full text-[var(--color-deep-purple)] flex items-center justify-center cursor-pointer hover:bg-[var(--color-accent-purple)] transition-colors">
            <MessageCircle size={20} />
          </div>
        </Card>
      </div> */}
    </>
  );
}
