"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

interface PollResultsProps {
  options: PollOption[];
  totalVotes: number;
  resultsVisibility?: string;
  isOwner: boolean;
  allowMultipleVotes: boolean;
  actualVoteCast: boolean;
}

export function PollResults({
  options,
  totalVotes,
  resultsVisibility,
  isOwner,
  allowMultipleVotes,
  actualVoteCast,
}: PollResultsProps) {
  const highestVotes = Math.max(...options.map((o) => o.voteCount), 0);

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pt-2"
    >
      {actualVoteCast && (
        <div className="flex items-center gap-2 text-green-500 font-semibold mb-6 bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20 w-fit">
          <CheckCircle2 className="w-5 h-5" />
          Your vote has been recorded
        </div>
      )}

      {resultsVisibility !== "PUBLIC" && !isOwner ? (
        <div className="py-16 text-center flex flex-col items-center justify-center gap-4 text-foreground/50 bg-foreground/5 rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center">
            <Lock className="w-8 h-8 opacity-70" />
          </div>
          <p className="font-semibold text-xl text-foreground/80">Results are Private</p>
          <p className="text-sm max-w-xs mx-auto">
            The creator of this poll has chosen to hide the live results from public view.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {options
            .sort((a, b) => b.voteCount - a.voteCount)
            .map((option) => {
              const percent =
                totalVotes === 0
                  ? 0
                  : Math.round((option.voteCount / totalVotes) * 100);
              const isWinner = option.voteCount === highestVotes && highestVotes > 0;

              return (
                <div key={option.id} className="relative space-y-2">
                  <div className="flex justify-between items-end px-1 text-foreground">
                    <span className="font-semibold text-lg">{option.text}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-2xl">{percent}%</span>
                      <span className="text-sm text-foreground/60 w-16 text-right">
                        {option.voteCount} {option.voteCount === 1 ? "vote" : "votes"}
                      </span>
                    </div>
                  </div>

                  <div className="h-10 w-full bg-foreground/5 rounded-xl overflow-hidden border border-border shadow-inner p-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-lg relative overflow-hidden flex items-center shadow-sm ${
                        isWinner ? "bg-violet-500" : "bg-foreground/20"
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </motion.div>
  );
}
