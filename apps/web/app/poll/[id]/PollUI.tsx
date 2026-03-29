"use client";

import { useState, useEffect } from "react";
import fpPromise from "@fingerprintjs/fingerprintjs";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import useSWR from "swr";
import { updatePollSettings, deletePoll } from "../../actions";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { CommentsSection } from "./CommentsSection";
import { PollVoting } from "./components/PollVoting";
import { PollResults } from "./components/PollResults";
import { PollSidebar } from "./components/PollSidebar";
import { PollSettingsModal } from "./components/PollSettingsModal";
import { TechnicalBackButton } from "../../components/TechnicalBackButton";

interface PollOption { id: string; pollId: string; text: string; voteCount: number; }
interface Poll {
  id: string; title: string; description: string | null; creator?: { name?: string | null; email?: string | null };
  createdAt: Date; options: PollOption[]; totalVotes: number; allowMultipleVotes: boolean; 
  requireNames?: boolean; hasOtherOption?: boolean; allowComments?: boolean; hideShareButton?: boolean;
  anonymizeData?: boolean; resultsVisibility?: string;
}

export function PollUI({ initialPoll, hasVotedInitial, isOwner }: { initialPoll: Poll, hasVotedInitial: boolean, isOwner: boolean }) {
  const router = useRouter();
  const [hasVoted, setHasVoted] = useState(hasVotedInitial);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [votingError, setVotingError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [voterName, setVoterName] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [viewingResults, setViewingResults] = useState(false);

  useEffect(() => {
    fpPromise.load().then(fp => fp.get()).then(res => setFingerprint(res.visitorId));
  }, []);

  const { data: pollData, mutate } = useSWR<Poll>(`/api/vote?pollId=${initialPoll.id}`, 
    (url: string) => fetch(url).then(res => res.json()), { refreshInterval: 3000, fallbackData: initialPoll });

  const displayPoll = pollData || initialPoll;
  const createdAtFormatted = initialPoll.createdAt ? new Date(initialPoll.createdAt).toLocaleDateString() : "recently";

  const handleUpdateSetting = async (setting: string, value: any) => {
    setIsUpdating(true);
    try { await updatePollSettings(initialPoll.id, { [setting]: value }); mutate(); } finally { setIsUpdating(false); }
  };

  const handleVote = async () => {
    if (!selectedOptionId) return;
    setIsVoting(true); setVotingError(null);
    try {
      const res = await fetch("/api/vote", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: initialPoll.id, optionId: selectedOptionId, fingerprintClient: fingerprint, voterName, customAnswer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setVoteSuccess(true);
      mutate();
    } catch (e) { setVotingError(e instanceof Error ? e.message : "Failed"); } finally { setIsVoting(false); }
  };

  const topOption = displayPoll.options.reduce((prev, current) => (prev.voteCount > current.voteCount) ? prev : current);

  return (
    <div className="w-full max-w-7xl mx-auto selection:bg-foreground/20 pb-20 px-6 pt-0">
      <TechnicalBackButton 
        href={isOwner ? "/dashboard" : "/"} 
        text={isOwner ? "Back to Dashboard" : "Back to Home"} 
      />
      <Card className="glass border-border shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-border">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{displayPoll.title}</h1>
              {displayPoll.description && <p className="text-xl text-foreground/60 font-medium leading-relaxed">{displayPoll.description}</p>}
            </div>
            <AnimatePresence mode="wait">
              {voteSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/20">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black">Vote Received!</h2>
                    <p className="text-lg text-foreground/60 font-medium">Your choice has been recorded successfully.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
                    <Button onClick={() => { setVoteSuccess(false); setHasVoted(true); }} size="lg" className="w-full bg-foreground text-background font-bold h-14 rounded-2xl shadow-xl hover:opacity-90 transition-all">Show Results</Button>
                    {displayPoll.allowMultipleVotes && (
                      <Button onClick={() => { setVoteSuccess(false); setSelectedOptionId(null); }} variant="outline" size="lg" className="w-full h-14 rounded-2xl font-bold border-foreground/20 hover:border-foreground transition-all">Vote Again</Button>
                    )}
                  </div>
                </motion.div>
              ) : (!hasVoted && !viewingResults) && !isOwner ? (
                <PollVoting options={displayPoll.options} selectedOptionId={selectedOptionId} onSelectOption={setSelectedOptionId} onVote={handleVote} onViewResults={() => setViewingResults(true)} isVoting={isVoting} votingError={votingError} requireNames={displayPoll.requireNames} voterName={voterName} setVoterName={setVoterName} customAnswer={customAnswer} setCustomAnswer={setCustomAnswer} />
              ) : (
                <div className="space-y-8">
                  <PollResults options={displayPoll.options} totalVotes={displayPoll.totalVotes} resultsVisibility={displayPoll.resultsVisibility} isOwner={isOwner} allowMultipleVotes={displayPoll.allowMultipleVotes} actualVoteCast={hasVoted && !viewingResults} />
                  {!hasVoted && viewingResults && (
                    <Button onClick={() => setViewingResults(false)} variant="ghost" className="font-bold text-violet-500 hover:text-violet-600 hover:bg-violet-500/5">
                      ← Back to Voting
                    </Button>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
          <div className="lg:col-span-4 p-8 sm:p-12 bg-foreground/[0.02]">
            <PollSidebar id={displayPoll.id} totalVotes={displayPoll.totalVotes} topOption={topOption.voteCount > 0 ? topOption : undefined} createdAtFormatted={createdAtFormatted} creatorName={initialPoll.creator?.name || "Guest"} hideShareButton={displayPoll.hideShareButton} copied={copied} onCopyLink={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} isOwner={isOwner} onOpenSettings={() => setIsSettingsOpen(true)} onDelete={async () => { if (window.confirm("Delete poll?")) { await deletePoll(initialPoll.id); router.push("/dashboard"); } }} />
          </div>
        </div>
      </Card>
      {displayPoll.allowComments && <div className="mt-12"><CommentsSection pollId={displayPoll.id} /></div>}
      <PollSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={displayPoll} onUpdate={handleUpdateSetting} isUpdating={isUpdating} />
    </div>
  );
}

function SocialIcon({ icon, color }: { icon: any, color?: string }) {
  return (
    <button className={`w-full aspect-square rounded-xl bg-foreground/5 border border-border text-foreground hover:text-white flex items-center justify-center transition-all ${color}`}>
      {icon}
    </button>
  );
}
