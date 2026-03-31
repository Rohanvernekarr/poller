import { TechnicalBackButton } from "../../components/TechnicalBackButton";

export default function PollLoading() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 w-full max-w-5xl mx-auto animate-pulse">
      <TechnicalBackButton 
        href="#" 
        text="..." 
      />
      <div className="glass border-border bg-background/50 rounded-[2rem] overflow-hidden min-h-[600px] flex flex-col lg:flex-row">
        <div className="lg:w-2/3 p-5 sm:p-10 space-y-12">
          <div className="space-y-4">
            <div className="h-12 w-3/4 bg-foreground/10 rounded-xl" />
            <div className="h-4 w-1/2 bg-foreground/5 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-foreground/[0.03] border border-border/50 rounded-2xl" />
            ))}
          </div>

          <div className="flex gap-4">
            <div className="h-12 w-40 bg-foreground/10 rounded-xl" />
            <div className="h-12 w-32 bg-foreground/5 rounded-xl" />
          </div>
        </div>
        
        <div className="lg:w-1/3 p-5 sm:p-10 bg-foreground/[0.01] border-l border-border/50 space-y-8">
          <div className="space-y-4">
            <div className="h-4 w-20 bg-foreground/10 rounded-full" />
            <div className="space-y-3">
              <div className="h-12 bg-foreground/5 rounded-xl" />
              <div className="h-12 bg-foreground/5 rounded-xl" />
              <div className="h-12 bg-foreground/5 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
