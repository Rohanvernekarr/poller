"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, MessageSquare, Eye, Lock, Globe, Copy, ShieldCheck, Mail, Users } from "lucide-react";
import { Button } from "@repo/ui/button";

interface PollSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    allowComments?: boolean;
    resultsVisibility?: string;
    allowMultipleVotes?: boolean;
    hideShareButton?: boolean;
    anonymizeData?: boolean;
  };
  onUpdate: (setting: string, value: any) => void;
  isUpdating: boolean;
}

export function PollSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdate,
  isUpdating,
}: PollSettingsModalProps) {
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
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Poll Settings</h3>
                  <p className="text-sm text-foreground/60 font-medium">Customize your poll behavior</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Toggles Group */}
              <div className="space-y-6">
                <SettingToggle
                  icon={<MessageSquare className="w-5 h-5" />}
                  title="Enable Comments"
                  description="Allow participants to discuss the poll"
                  checked={!!settings.allowComments}
                  onChange={(val) => onUpdate("allowComments", val)}
                  disabled={isUpdating}
                />
                
                <SettingToggle
                  icon={<Copy className="w-5 h-5" />}
                  title="Allow Multiple Votes"
                  description="Participants can vote more than once"
                  checked={!!settings.allowMultipleVotes}
                  onChange={(val) => onUpdate("allowMultipleVotes", val)}
                  disabled={isUpdating}
                />

                <SettingToggle
                  icon={<Globe className="w-5 h-5" />}
                  title="Show Share Button"
                  description="Make the share widget visible to voters"
                  checked={!settings.hideShareButton}
                  onChange={(val) => onUpdate("hideShareButton", !val)}
                  disabled={isUpdating}
                />

                <SettingToggle
                  icon={<ShieldCheck className="w-5 h-5" />}
                  title="Anonymize Data"
                  description="Hide participant IP information in results"
                  checked={!!settings.anonymizeData}
                  onChange={(val) => onUpdate("anonymizeData", val)}
                  disabled={isUpdating}
                />
              </div>

              {/* Select Option */}
              <div className="pt-6 border-t border-border space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-foreground/40" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-foreground/40">Results Visibility</label>
                    <select
                      value={settings.resultsVisibility || "PUBLIC"}
                      onChange={(e) => onUpdate("resultsVisibility", e.target.value)}
                      disabled={isUpdating}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer appearance-none shadow-sm"
                    >
                      <option value="PUBLIC">Always Public</option>
                      <option value="ADMIN_ONLY">Admin Only</option>
                      <option value="HIDDEN">Completely Hidden</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-foreground/5 flex justify-end">
              <Button
                onClick={onClose}
                isLoading={isUpdating}
                className="bg-foreground text-background font-bold px-8 rounded-xl h-12 hover:opacity-90 transition-all shadow-xl"
              >
                Save & Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SettingToggle({
  icon,
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
          <div className="text-foreground/40 group-hover:text-foreground transition-colors">
            {icon}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-foreground leading-tight">{title}</h4>
          <p className="text-xs font-medium text-foreground/40 mt-0.5">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className="w-12 h-6 bg-foreground/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground transition-all"></div>
      </label>
    </div>
  );
}
