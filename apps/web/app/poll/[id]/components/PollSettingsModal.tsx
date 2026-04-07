"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, MessageSquare, Eye, Copy, Globe, ShieldCheck, UserCheck, Mail, Square, Play } from "lucide-react";
import { Button } from "@repo/ui/button";
import { closePoll, reopenPoll } from "../../../utils/actions";

interface SettingsData {
  allowComments?: boolean;
  resultsVisibility?: string;
  allowMultipleVotes?: boolean;
  hideShareButton?: boolean;
  anonymizeData?: boolean;
  allowedDomains?: string | null;
  requireAuth?: boolean;
  requireNames?: boolean;
}

interface PollSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollId: string;
  isExpired: boolean;
  settings: SettingsData;
  onUpdate: (setting: string, value: any) => void;
  isUpdating: boolean;
  onMutate: () => void;
}

export function PollSettingsModal({ isOpen, onClose, pollId, isExpired, settings, onUpdate, isUpdating, onMutate }: PollSettingsModalProps) {
  const [localDomains, setLocalDomains] = useState(settings.allowedDomains || "");
  const [domainsChanged, setDomainsChanged] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isReopening, setIsReopening] = useState(false);

  useEffect(() => {
    setLocalDomains(settings.allowedDomains || "");
    setDomainsChanged(false);
    setIsClosing(false);
    setIsReopening(false);
  }, [settings.allowedDomains, isOpen]);

  const handleDomainSave = () => {
    onUpdate("allowedDomains", localDomains.trim() || null);
    setDomainsChanged(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-background border border-border shadow-2xl rounded-[2rem] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <Settings2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-widest">Poll Settings</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Changes save instantly</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/30 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="p-7 space-y-1 max-h-[70vh] overflow-y-auto">

              {/* ── Voting Behavior ── */}
              <SectionLabel>Voting Behavior</SectionLabel>

              <SettingToggle
                icon={<Copy className="w-4 h-4" />}
                title="Multiple Votes"
                description="Participants can vote more than once"
                checked={!!settings.allowMultipleVotes}
                onChange={(val) => onUpdate("allowMultipleVotes", val)}
                disabled={isUpdating}
              />

              <SettingToggle
                icon={<UserCheck className="w-4 h-4" />}
                title="Require Name"
                description="Voters must enter a display name"
                checked={!!settings.requireNames && !settings.requireAuth}
                onChange={(val) => onUpdate("requireNames", val)}
                disabled={isUpdating || !!settings.requireAuth}
                note={settings.requireAuth ? "Disabled when Sign In Required is on" : undefined}
              />

              {/* ── Access Control ── */}
              <SectionLabel className="pt-6">Access Control</SectionLabel>

              <SettingToggle
                icon={<UserCheck className="w-4 h-4" />}
                title="Sign In Required"
                description="Only authenticated users can vote"
                checked={!!settings.requireAuth}
                onChange={(val) => onUpdate("requireAuth", val)}
                disabled={isUpdating}
              />

              {/* Allowed Domains */}
              <div className="flex items-start gap-4 py-4">
                <div className="w-9 h-9 rounded-2xl bg-foreground/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-foreground/40" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Allowed Email Domains</p>
                    <p className="text-[10px] font-medium text-foreground/40 mt-0.5">Restrict voting to specific email domains. Leave empty to allow anyone.</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={localDomains}
                      onChange={(e) => { setLocalDomains(e.target.value); setDomainsChanged(true); }}
                      placeholder="@company.com, @university.edu"
                      className="flex-1 h-10 px-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/20 transition-all font-medium"
                    />
                    {domainsChanged && (
                      <Button
                        onClick={handleDomainSave}
                        isLoading={isUpdating}
                        size="sm"
                        className="h-10 px-4 rounded-xl bg-foreground text-background font-black uppercase tracking-widest text-[10px]"
                      >
                        Save
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Visibility & Sharing ── */}
              <SectionLabel className="pt-6">Visibility & Sharing</SectionLabel>

              <div className="flex items-start gap-4 py-4">
                <div className="w-9 h-9 rounded-2xl bg-foreground/5 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-foreground/40" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Results Visibility</p>
                    <p className="text-[10px] font-medium text-foreground/40 mt-0.5">Who can see the poll results</p>
                  </div>
                  <select
                    value={settings.resultsVisibility || "PUBLIC"}
                    onChange={(e) => onUpdate("resultsVisibility", e.target.value)}
                    disabled={isUpdating}
                    className="w-full h-10 px-3 rounded-xl border border-foreground/[0.08] bg-foreground/[0.04] text-foreground text-sm font-bold focus:outline-none focus:border-foreground/20 cursor-pointer appearance-none"
                  >
                    <option value="PUBLIC">Always Public</option>
                    <option value="ADMIN_ONLY">Admin Only</option>
                    <option value="HIDDEN">Completely Hidden</option>
                    <option value="AFTER_VOTE">After Voting</option>
                  </select>
                </div>
              </div>

              <SettingToggle
                icon={<Globe className="w-4 h-4" />}
                title="Show Share Button"
                description="Display the share widget to voters"
                checked={!settings.hideShareButton}
                onChange={(val) => onUpdate("hideShareButton", !val)}
                disabled={isUpdating}
              />

              {/* ── Privacy & Engagement ── */}
              <SectionLabel className="pt-6">Privacy & Engagement</SectionLabel>

              <SettingToggle
                icon={<ShieldCheck className="w-4 h-4" />}
                title="Anonymize IP"
                description="Redact voter IP and fingerprint from your results"
                checked={!!settings.anonymizeData}
                onChange={(val) => onUpdate("anonymizeData", val)}
                disabled={isUpdating}
              />

              <SettingToggle
                icon={<MessageSquare className="w-4 h-4" />}
                title="Enable Comments"
                description="Allow participants to discuss the poll"
                checked={!!settings.allowComments}
                onChange={(val) => onUpdate("allowComments", val)}
                disabled={isUpdating}
              />

              {/* Poll Status */}
              <SectionLabel className="pt-8">Poll Status</SectionLabel>
              <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-4 space-y-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-foreground">
                    {isExpired ? "Poll is Currently Closed" : "Stop Accepting Votes"}
                  </p>
                  <p className="text-[10px] font-medium text-foreground/40 mt-1">
                    {isExpired
                      ? "Voting has ended. You can reopen this poll to accept new votes again."
                      : "Immediately stop new votes. You can reopen the poll anytime."}
                  </p>
                </div>
                {isExpired ? (
                  <Button
                    onClick={async () => {
                      setIsReopening(true);
                      try { await reopenPoll(pollId); onMutate(); } finally { setIsReopening(false); }
                    }}
                    isLoading={isReopening}
                    className="h-9 px-5 rounded-xl bg-foreground text-background font-black uppercase tracking-widest text-[10px] hover:opacity-90 flex items-center gap-2"
                  >
                    <Play className="w-3 h-3" />
                    Reopen Poll
                  </Button>
                ) : (
                  <Button
                    onClick={async () => {
                      setIsClosing(true);
                      try { await closePoll(pollId); onMutate(); } finally { setIsClosing(false); }
                    }}
                    isLoading={isClosing}
                    className="h-9 px-5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-red-500/20 flex items-center gap-2"
                  >
                    <Square className="w-3 h-3" />
                    Stop Voting
                  </Button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 border-t border-border flex justify-end">
              <Button
                onClick={onClose}
                isLoading={isUpdating}
                className="bg-foreground text-background font-black uppercase tracking-widest px-8 rounded-xl h-11 hover:opacity-90 transition-all"
              >
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[9px] font-black uppercase tracking-widest text-foreground/25 pb-1 ${className ?? ""}`}>
      {children}
    </p>
  );
}

function SettingToggle({
  icon, title, description, checked, onChange, disabled, note,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled: boolean;
  note?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-3.5 group ${disabled ? "opacity-40" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-foreground/5 flex items-center justify-center flex-shrink-0 text-foreground/40 group-hover:text-foreground group-hover:bg-foreground/10 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-foreground leading-tight">{title}</p>
          <p className="text-[10px] font-medium text-foreground/40 mt-0.5">{description}</p>
          {note && <p className="text-[9px] font-black uppercase tracking-widest text-foreground/25 mt-1 italic">{note}</p>}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className="w-11 h-6 bg-foreground/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground transition-all" />
      </label>
    </div>
  );
}
