import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  body: string;
  className?: string;
  delay?: number;
  float?: "a" | "b";
};

export function InfoCard({ label, title, body, className, delay = 0, float = "a" }: Props) {
  return (
    <div
      className={cn("absolute w-[min(21rem,26vw)] reveal", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("glass-card p-6", float === "a" ? "float-a" : "float-b")}>
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.32em] text-gold">{label}</p>
        <h3 className="mt-3 font-serif text-xl leading-snug text-parchment">{title}</h3>
        <p className="mt-2 font-sans text-[0.8rem] leading-relaxed text-parchment-dim">{body}</p>
      </div>
    </div>
  );
}
