"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Flame, Calendar, Clock, CheckCircle2, Trophy, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetStreak, 
  useMarkStudied, 
  getGetStreakQueryKey, 
  getGetHistoryQueryKey 
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  variant = "default" 
}: { 
  title: string; 
  value: React.ReactNode; 
  subtitle?: string; 
  icon: React.ElementType;
  variant?: "default" | "highlight";
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 transition-all duration-300",
        "bg-card border shadow-lg hover:shadow-xl group",
        variant === "highlight" 
          ? "border-primary/20 shadow-primary/5 hover:border-primary/40 hover:shadow-primary/10" 
          : "border-border/50 shadow-black/5 hover:border-border"
      )}
    >
      {variant === "highlight" && (
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
      )}
      <div className={cn(
        "p-3 rounded-xl",
        variant === "highlight" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="font-display text-4xl font-bold tracking-tight text-foreground">{value}</h3>
          {subtitle && <span className="text-sm font-medium text-muted-foreground">{subtitle}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: streak, isLoading, isError } = useGetStreak();
  
  const markMutation = useMarkStudied({
    mutation: {
      onSuccess: (data) => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#F97316', '#FBBF24', '#FCD34D']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#F97316', '#FBBF24', '#FCD34D']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();

        toast({
          title: "Incredible work! 🎉",
          description: data.message,
        });

        queryClient.invalidateQueries({ queryKey: getGetStreakQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: error?.response?.data?.message || "Something went wrong.",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="animate-pulse font-medium">Loading your progress...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <Flame className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground">Failed to load streak</h2>
        <p className="text-muted-foreground mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  const lastStudiedText = streak?.lastStudyDate 
    ? format(new Date(streak.lastStudyDate), "d MMMM yyyy") 
    : "Never";

  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center sm:text-left space-y-2"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Welcome back! 
          <span className="block sm:inline text-primary mt-1 sm:mt-0 sm:ml-3">
            Keep the streak going!
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Consistency is the key to mastery. Log your study sessions every day to build an unbreakable learning habit.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Current Streak" 
          value={streak?.currentStreak ?? 0}
          subtitle="days"
          icon={Flame}
          variant="highlight"
        />
        <StatCard 
          title="Total Days Studied" 
          value={streak?.totalDays ?? 0}
          subtitle="days"
          icon={Trophy}
        />
        <StatCard 
          title="Last Studied" 
          value={
            <span className={cn(
              "text-2xl", 
              !streak?.lastStudyDate && "text-muted-foreground italic"
            )}>
              {lastStudiedText}
            </span>
          }
          icon={Clock}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mt-4"
      >
        <button
          onClick={() => markMutation.mutate()}
          disabled={streak?.studiedToday || markMutation.isPending}
          className={cn(
            "relative overflow-hidden w-full sm:w-auto px-8 sm:px-16 py-6 sm:py-8 rounded-3xl font-display font-bold text-2xl sm:text-3xl transition-all duration-300 flex items-center justify-center gap-4",
            streak?.studiedToday 
              ? "bg-secondary text-secondary-foreground/60 cursor-not-allowed shadow-inner"
              : "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:translate-y-1 active:shadow-md cursor-pointer group"
          )}
        >
          {streak?.studiedToday ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-primary" />
              You have already marked today
            </>
          ) : markMutation.isPending ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              Marking...
            </>
          ) : (
            <>
              <Flame className="w-8 h-8 fill-primary-foreground/20 group-hover:scale-110 transition-transform" />
              I Studied Today!
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
