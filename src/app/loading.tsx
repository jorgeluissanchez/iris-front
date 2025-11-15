import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Gradient - same as landing page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 left-0 w-[150%] h-[150%]"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, oklch(0.75 0.15 195 / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, oklch(0.82 0.18 330 / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, oklch(0.88 0.16 85 / 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">Cargando...</p>
      </div>
    </div>
  );
}
