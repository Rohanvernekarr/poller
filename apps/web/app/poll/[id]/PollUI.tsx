"use client";

import { useState, useEffect } from "react";
import fpPromise from "@fingerprintjs/fingerprintjs";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import useSWR from "swr";
import { CheckCircle2, Copy, Lock } from "lucide-react";
import { Input } from "@repo/ui/input";
import { CommentsSection } from "./CommentsSection";

interface PollOption {
  id: string;
  pollId: string;
  text: string;
  voteCount: number;
}

interface Poll {
  id: string;
  title: string;
  description: string | null;
  options: PollOption[];
  totalVotes: number;
  allowMultipleVotes: boolean;
  requireNames?: boolean;
  hasOtherOption?: boolean;
  allowComments?: boolean;
  hideShareButton?: boolean;
  anonymizeData?: boolean;
  resultsVisibility?: string;
}

export function PollUI({ initialPoll, hasVotedInitial }: { initialPoll: Poll, hasVotedInitial: boolean }) {
  const [hasVoted, setHasVoted] = useState(hasVotedInitial);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [votingError, setVotingError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [voterName, setVoterName] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");

  useEffect(() => {
    async function getFingerprint() {
      const fp = await fpPromise.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
    }
    getFingerprint();
  }, []);

  const { data: pollData, mutate } = useSWR<Poll>(
    hasVoted ? `/api/vote?pollId=${initialPoll.id}` : null,
    (url: string) => fetch(url).then((res) => res.json()),
    { refreshInterval: 3000 } // Auto refresh results every 3 seconds
  );

  const displayPoll = pollData || initialPoll;

  const handleVote = async () => {
    if (!selectedOptionId) return;
    
    setIsVoting(true);
    setVotingError(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId: initialPoll.id,
          optionId: selectedOptionId,
          fingerprintClient: fingerprint,
          voterName,
          customAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to vote");
      }

      setHasVoted(true);
      if (!initialPoll.allowMultipleVotes) {
        // if not allowed, trigger visual state immediately
      } else {
        // if allowed multiple votes, reset selected so they can vote again
        setSelectedOptionId(null);
        setHasVoted(false);
      }
      mutate(); // force immediate refresh
    } catch (e) {
      setVotingError(e instanceof Error ? e.message : "Voting failed");
    } finally {
      setIsVoting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass border-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-border" />
        
        <CardHeader className="text-center pb-8 pt-8 px-8">
          <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">{displayPoll.title}</CardTitle>
          {displayPoll.description && (
            <CardDescription className="text-lg mb-4 text-foreground/70">
              {displayPoll.description}
            </CardDescription>
          )}
          
          <div className="flex items-center justify-center gap-4 text-sm text-foreground/60 font-medium">
            <span>{displayPoll.totalVotes.toLocaleString()} votes</span>
            {!displayPoll.hideShareButton && (
              <>
                <span>•</span>
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center hover:text-foreground transition-colors gap-1"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Share Link"}
                </button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <AnimatePresence mode="wait">
            {!hasVoted ? (
              <motion.div
                key="voting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {displayPoll.options.map((option: PollOption) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`p-5 rounded-2xl cursor-pointer border-2 transition-all ${
                      selectedOptionId === option.id
                        ? "border-foreground bg-foreground/5 shadow-lg shadow-black/10 dark:shadow-white/10"
                        : "border-border bg-foreground/5 hover:bg-foreground/10"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{option.text}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedOptionId === option.id ? "border-foreground" : "border-gray-500"
                        }`}>
                          {selectedOptionId === option.id && <div className="w-3 h-3 rounded-full bg-foreground" />}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {selectedOptionId === option.id && option.text === "Other (Please specify)" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                            exit={{ height: 0, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Input 
                              placeholder="Type your answer here..." 
                              value={customAnswer}
                              onChange={(e) => setCustomAnswer(e.target.value)}
                              className="bg-background"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}

                {displayPoll.requireNames && (
                  <div className="pt-2 pb-2">
                    <label className="text-sm font-medium text-foreground mb-2 block">Your Name (Required)</label>
                    <Input 
                      placeholder="Enter your name" 
                      value={voterName} 
                      onChange={(e) => setVoterName(e.target.value)}
                      required
                    />
                  </div>
                )}

                {votingError && (
                  <div className="text-red-500 text-sm text-center font-medium bg-red-500/10 py-3 rounded-lg border border-red-500/20">
                    {votingError}
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    size="lg"
                    className="w-full text-lg shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]"
                    onClick={handleVote}
                    disabled={!selectedOptionId}
                    isLoading={isVoting}
                  >
                    {isVoting ? "Submitting..." : "Submit Vote"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 pt-2"
              >
                {!initialPoll.allowMultipleVotes && (
                  <div className="flex items-center justify-center gap-2 text-secondary font-semibold mb-6">
                    <CheckCircle2 className="w-5 h-5" />
                    Vote recorded successfully
                  </div>
                )}

                {displayPoll.resultsVisibility === "HIDDEN" || displayPoll.resultsVisibility === "ADMIN_ONLY" ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center gap-4 text-gray-500">
                    <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
                      <Lock className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium text-lg">Results are hidden</p>
                    <p className="text-sm">The creator of this poll has chosen to hide the live results.</p>
                  </div>
                ) : (
                  <>
                    {displayPoll.options
                      .sort((a: PollOption, b: PollOption) => b.voteCount - a.voteCount)
                      .map((option: PollOption) => {
                      const percent = displayPoll.totalVotes === 0 
                        ? 0 
                        : Math.round((option.voteCount / displayPoll.totalVotes) * 100);
                      
                      return (
                        <div key={option.id} className="relative">
                          <div className="flex justify-between items-end mb-2 px-1 text-foreground">
                            <span className="font-semibold text-lg drop-shadow-sm">{option.text}</span>
                            <div className="flex flex-col items-end">
                              <span className="font-bold text-xl drop-shadow-md">{percent}%</span>
                              <span className="text-xs text-foreground/60 font-medium">{option.voteCount.toLocaleString()} votes</span>
                            </div>
                          </div>
                          
                          {/* Bar Background container */}
                          <div className="h-12 w-full bg-foreground/5 rounded-xl overflow-hidden backdrop-blur-sm border border-foreground/5 shadow-inner p-1">
                            {/* The Actual Progress Bar */}
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-foreground rounded-lg relative overflow-hidden flex items-center shadow-md dark:shadow-white/10 shadow-black/10"
                            >
                              <div className="absolute inset-0 bg-background/10 opacity-0 hover:opacity-100 transition-opacity" />
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {displayPoll.allowComments && (
        <CommentsSection pollId={displayPoll.id} />
      )}
    </motion.div>
  );
}
