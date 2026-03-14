"use client";

import { motion } from "framer-motion";
import { Calendar, History as HistoryIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useGetHistory } from "@workspace/api-client-react";

export default function History() {
  const { data, isLoading, isError } = useGetHistory();

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 border-b border-border/50 pb-6"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <HistoryIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Study History
          </h1>
          <p className="text-muted-foreground mt-1">
            Your learning journey mapped out day by day.
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="animate-pulse font-medium">Loading history...</p>
        </div>
      ) : isError ? (
        <div className="py-20 text-center">
          <p className="text-destructive font-medium">Failed to load study history.</p>
        </div>
      ) : data?.dates?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-secondary/50 rounded-3xl border border-dashed border-border"
        >
          <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-foreground">No sessions yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Looks like you haven't started your streak. Go to the dashboard and mark your first study session!
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
          
          <ul className="space-y-6">
            {data?.dates.map((dateStr, i) => {
              const dateObj = new Date(dateStr);
              return (
                <motion.li 
                  key={dateStr}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-6 group relative"
                >
                  <div className="w-14 h-14 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center shrink-0 z-10 group-hover:border-primary/50 group-hover:shadow-primary/10 transition-all duration-300">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 bg-card border border-border/50 shadow-sm rounded-2xl px-6 py-4 group-hover:shadow-md transition-shadow duration-300">
                    <p className="text-lg font-medium text-foreground">
                      {format(dateObj, "dd MMMM yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(dateObj, "EEEE")}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
