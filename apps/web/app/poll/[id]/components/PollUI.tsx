"use client";

import { useState, useEffect } from "react";
import fpPromise from "@fingerprintjs/fingerprintjs";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import useSWR from "swr";
import { updatePollSettings, deletePoll, closePoll, reopenPoll } from "../../../utils/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CheckCircle2, Lock, Clock } from "lucide-react";
import { CommentsSection } from "./CommentsSection";
import { PollVoting } from "./PollVoting";
import { PollResults } from "./PollResults";
import { PollSidebar } from "./PollSidebar";
import { PollSettingsModal } from "./PollSettingsModal";
import { TechnicalBackButton } from "../../../components/TechnicalBackButton";
import { DeletePollModal } from "../../../components/DeletePollModal";

interface PollOption { id: string; pollId: string; text: string; voteCount: number; }
interface Poll {
  id: string; title: string; description: string | null; creator?: { name?: string | null; email?: string | null };
  createdAt: Date; options: PollOption[]; totalVotes: number; allowMultipleVotes: boolean; 
  requireNames?: boolean; hasOtherOption?: boolean; allowComments?: boolean; hideShareButton?: boolean;
  anonymizeData?: boolean; resultsVisibility?: string; allowedDomains?: string | null;
  expiresAt?: Date | string | null; requireAuth?: boolean;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStoppingVoting, setIsStoppingVoting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [viewingResults, setViewingResults] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    window.scrollTo(0, 0);
    fpPromise.load().then(fp => fp.get()).then(res => setFingerprint(res.visitorId));
  }, []);

  const { data: pollData, mutate } = useSWR<Poll>(`/api/vote?pollId=${initialPoll.id}`, 
    (url: string) => fetch(url).then(res => res.json()), { refreshInterval: 3000, fallbackData: initialPoll });

  const displayPoll = pollData || initialPoll;
  const createdAtFormatted = initialPoll.createdAt ? new Date(initialPoll.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "recently";
  const isExpired = !!displayPoll.expiresAt && new Date() > new Date(displayPoll.expiresAt);

  const handleUpdateSetting = async (setting: string, value: any) => {
    setIsUpdating(true);
    try { await updatePollSettings(initialPoll.id, { [setting]: value }); mutate(); } finally { setIsUpdating(false); }
  };

  const handleStopVoting = async () => {
    setIsStoppingVoting(true);
    try { await closePoll(initialPoll.id); mutate(); } finally { setIsStoppingVoting(false); }
  };

  const handleReopenPoll = async () => {
    setIsStoppingVoting(true);
    try { await reopenPoll(initialPoll.id); mutate(); } finally { setIsStoppingVoting(false); }
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

  // Auth & Domain Restriction Logic
  let isAuthAllowed = true;
  let authError = "";
  
  if (displayPoll.requireAuth && status === "unauthenticated") {
    isAuthAllowed = false;
    authError = "This poll requires you to sign in to vote.";
  } else if (displayPoll.allowedDomains) {
    if (status === "unauthenticated") {
      isAuthAllowed = false;
      authError = "You must sign in to vote on this restricted poll.";
    } else if (session?.user?.email) {
      const userDomain = session.user.email.split("@")[1]?.toLowerCase();
      const allowedList = displayPoll.allowedDomains.toLowerCase().split(",").map(d => d.trim());
      const isAllowed = allowedList.some(domain => {
        const cleanDomain = domain.startsWith("@") ? domain.substring(1) : domain;
        return userDomain === cleanDomain;
      });
      if (!isAllowed) {
        isAuthAllowed = false;
        authError = `Your email domain (@${userDomain}) is not authorized. Allowed domains: ${displayPoll.allowedDomains}`;
      }
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto selection:bg-foreground/20 pb-20 px-0 sm:px-6 pt-0">
      <div className="px-6 sm:px-0">
        <TechnicalBackButton 
          href={session?.user ? "/dashboard" : "/"} 
          text={session?.user ? "Back to Dashboard" : "Back to Home"} 
        />
      </div>
      <Card className="glass border-border sm:border shadow-2xl rounded-none sm:rounded-[2rem] overflow-hidden bg-background/50 backdrop-blur-sm border-x-0 sm:border-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 p-5 sm:p-10 border-b lg:border-b-0 lg:border-r border-border">
            <div className="mb-8 flex justify-between items-start">             
              <div>
                <h1 className="text-2xl md:text-5xl font-black tracking-tight mb-3 leading-tight uppercase italic">{displayPoll.title}</h1>
                {displayPoll.description && <p className="text-base md:text-lg text-foreground/60 font-medium leading-relaxed">{displayPoll.description}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                {isExpired && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Ended</span>
                  </div>
                )}
                {!isExpired && displayPoll.expiresAt && (
                  <LiveTimer expiresAt={displayPoll.expiresAt} />
                )}
              </div>
            </div>
            <AnimatePresence mode="wait">
              {voteSuccess ? (
                <div className="py-12 sm:py-20 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/20">
                    <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12 text-green-500" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-xl sm:text-3xl font-black uppercase italic">Vote Received!</h2>
                    <p className="text-sm sm:text-lg text-foreground/60 font-medium">Your choice has been recorded.</p>
                  </div>
                  <div className="sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-sm">
                    <Button onClick={() => { setVoteSuccess(false); setHasVoted(true); }} size="lg" className="w-full bg-foreground text-background font-black uppercase tracking-widest h-12 sm:h-14 rounded-xl sm:rounded-2xl shadow-xl hover:opacity-90 transition-all text-xs sm:text-sm">View Results</Button>
                    {(displayPoll.allowMultipleVotes && !isExpired) && (
                      <Button onClick={() => { setVoteSuccess(false); setSelectedOptionId(null); }} variant="outline" size="lg" className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest border-foreground/10 hover:border-foreground transition-all text-xs sm:text-sm">Vote Again</Button>
                    )}
                  </div>
                </div>
              ) : (!hasVoted && !viewingResults && !isExpired) && !isOwner ? (
                <>
                  {!isAuthAllowed ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                      <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-2">
                        <Lock className="w-10 h-10 text-foreground/40" />
                      </div>
                      <h2 className="text-3xl font-black uppercase tracking-tight italic">Restricted Poll</h2>
                      <p className="text-foreground/60 max-w-md">{authError}</p>
                      {status === "unauthenticated" && (
                        <Link href={`/signin?callbackUrl=${encodeURIComponent(`/poll/${displayPoll.id}`)}`}>
                          <Button size="lg" className="mt-4 px-10 h-14 bg-foreground text-background font-black uppercase tracking-widest rounded-2xl shadow-xl">
                            Sign In to Vote
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <PollVoting options={displayPoll.options} selectedOptionId={selectedOptionId} onSelectOption={setSelectedOptionId} onVote={handleVote} onViewResults={() => setViewingResults(true)} isVoting={isVoting} votingError={votingError} requireNames={!!(displayPoll.requireNames && !session?.user)} voterName={voterName} setVoterName={setVoterName} customAnswer={customAnswer} setCustomAnswer={setCustomAnswer} />
                  )}
                </>
              ) : (
                <div className="space-y-6 sm:space-y-8">
                  <PollResults options={displayPoll.options} totalVotes={displayPoll.totalVotes} resultsVisibility={displayPoll.resultsVisibility} isOwner={isOwner} allowMultipleVotes={displayPoll.allowMultipleVotes} actualVoteCast={hasVoted && !viewingResults} />
                  {!hasVoted && viewingResults && !isExpired && (
                    <Button onClick={() => setViewingResults(false)} variant="ghost" className="font-black uppercase tracking-widest text-[10px] text-foreground/40 hover:text-foreground">
                      ← Back to Voting
                    </Button>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
          <div className="lg:col-span-4 p-5 sm:p-10 bg-foreground/[0.01]">
            <PollSidebar 
              id={displayPoll.id} 
              totalVotes={displayPoll.totalVotes} 
              topOption={topOption.voteCount > 0 ? topOption : undefined} 
              createdAtFormatted={createdAtFormatted} 
              creatorName={initialPoll.creator?.name || "Guest"} 
              hideShareButton={displayPoll.hideShareButton} 
              copied={copied} 
              onCopyLink={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
              isOwner={isOwner} 
              isExpired={isExpired}
              onOpenSettings={() => setIsSettingsOpen(true)} 
              isDeleting={isDeleting}
              isStoppingVoting={isStoppingVoting}
              onStopVoting={handleStopVoting}
              onReopenPoll={handleReopenPoll}
              onDelete={() => setIsDeleteModalOpen(true)} 
            />
          </div>
        </div>
      </Card>
      {displayPoll.allowComments && <div className="mt-12"><CommentsSection pollId={displayPoll.id} /></div>}
      <PollSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} pollId={initialPoll.id} isExpired={isExpired} settings={{ ...displayPoll, requireAuth: displayPoll.requireAuth, requireNames: displayPoll.requireNames }} onUpdate={handleUpdateSetting} isUpdating={isUpdating} onMutate={() => mutate()} />
      <DeletePollModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        isDeleting={isDeleting}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await deletePoll(initialPoll.id); 
            router.push("/dashboard"); 
          } catch (e) {
            setIsDeleting(false);
            alert("Failed to delete poll");
          }
        }}
      />
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

function LiveTimer({ expiresAt }: { expiresAt: Date | string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return "Ending now...";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      return parts.join(" ");
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1.5 rounded-lg flex items-center gap-2">
      <Clock className="w-4 h-4 animate-pulse" />
      <span className="font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
        {timeLeft || "Calculating..."}
      </span>
    </div>
  );
}
