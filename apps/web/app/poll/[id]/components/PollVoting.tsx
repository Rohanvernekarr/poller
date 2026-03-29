"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { ArrowRight, BarChart3 } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
}

interface PollVotingProps {
  options: PollOption[];
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  onVote: () => void;
  onViewResults: () => void;
  isVoting: boolean;
  votingError: string | null;
  requireNames?: boolean;
  voterName: string;
  setVoterName: (name: string) => void;
  customAnswer: string;
  setCustomAnswer: (answer: string) => void;
}

export function PollVoting({
  options,
  selectedOptionId,
  onSelectOption,
  onVote,
  onViewResults,
  isVoting,
  votingError,
  requireNames,
  voterName,
  setVoterName,
  customAnswer,
  setCustomAnswer,
}: PollVotingProps) {
  return (
    <motion.div
      key="voting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <p className="text-lg font-semibold text-foreground/80 mb-2">Make a choice:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectOption(option.id)}
            className={`p-5 rounded-2xl cursor-pointer border-2 transition-all ${
              selectedOptionId === option.id
                ? "border-foreground bg-foreground/10 shadow-lg shadow-foreground/5"
                : "border-border bg-foreground/[0.03] hover:bg-foreground/[0.08]"
            }`}
          >
            <div className="flex flex-col h-full justify-center gap-3">
              <div className="flex items-center gap-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedOptionId === option.id ? "border-foreground" : "border-gray-500"
                  }`}
                >
                  {selectedOptionId === option.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                  )}
                </div>
                <span className="font-semibold text-lg">{option.text}</span>
              </div>

              <AnimatePresence>
                {selectedOptionId === option.id &&
                  option.text === "Other (Please specify)" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Input
                        placeholder="Type your answer here..."
                        value={customAnswer}
                        onChange={(e) => setCustomAnswer(e.target.value)}
                        className="bg-background mt-2 h-11"
                        autoFocus
                      />
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {requireNames && (
        <div className="pt-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Your Name (Required)
          </label>
          <Input
            placeholder="What is your name?"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            className="h-12 bg-background max-w-sm border-border"
            required
          />
        </div>
      )}

      {votingError && (
        <div className="text-red-500 text-sm font-medium bg-red-500/10 py-3 px-4 rounded-lg border border-red-500/20 max-w-sm">
          {votingError}
        </div>
      )}

      <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
        <Button
          size="lg"
          className="w-full sm:w-auto px-10 h-12 text-base shadow-xl bg-foreground text-background hover:opacity-90 border-none transition-all font-bold"
          onClick={onVote}
          disabled={!selectedOptionId}
          isLoading={isVoting}
        >
          {isVoting ? "Submitting..." : "Submit Vote"}{" "}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="w-full sm:w-auto h-12 font-medium"
          onClick={onViewResults}
        >
          View Results <BarChart3 className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
