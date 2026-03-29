"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Plus, Trash2, ArrowRight, Settings2, ChevronDown } from "lucide-react";
import { createPoll } from "../actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { TechnicalBackButton } from "../components/TechnicalBackButton";

export default function CreatePoll() {
  const { data: session } = useSession();
  const [options, setOptions] = useState([{ id: 1, text: "" }, { id: 2, text: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddOption = () => {
    if (options.length >= 10) return;
    setOptions([...options, { id: Date.now(), text: "" }]);
  };

  const handleRemoveOption = (id: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((o) => o.id !== id));
  };

  return (
    <div className="min-h-screen pt-0 pb-20 px-6 max-w-2xl mx-auto">
      <TechnicalBackButton 
        href={session ? "/dashboard" : "/"} 
        text={session ? "Back to Dashboard" : "Back to Home"} 
      />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {!session && (
          <div className="mb-10 p-10 rounded-[2.5rem] bg-foreground/5 border border-border flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 blur-3xl rounded-full" />
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-black uppercase tracking-widest text-foreground italic">Guest Session</p>
              <p className="text-xs text-foreground/40 font-black uppercase tracking-widest leading-loose max-w-md">
                You're creating this poll as a guest. 
                <Link href="/signin" className="text-foreground hover:underline transition-all ml-1 inline-flex items-center gap-2">
                  Sign in for permanent control <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>
        )}
        <Card className="glass border-border shadow-2xl overflow-hidden relative">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-border" />
          
          <CardHeader className="space-y-6 pt-12 text-center pb-12">
            <CardTitle className="text-5xl font-black uppercase tracking-tight italic leading-none">Create New Poll</CardTitle>
            <CardDescription className="text-foreground/40 font-black uppercase tracking-widest text-[10px] max-w-sm mx-auto">Complete the details below to generate your shareable link.</CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              action={async (formData) => {
                setIsSubmitting(true);
                try {
                  await createPoll(formData);
                } catch (e) {
                  if (e instanceof Error && (e.message === "NEXT_REDIRECT" || e.message === "NEXT_NOT_FOUND")) {
                    throw e;
                  }
                  alert(e instanceof Error ? e.message : "Error creating poll");
                  setIsSubmitting(false);
                }
              }} 
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Poll Title Question</label>
                <Input name="title" placeholder="e.g. What is your favorite framework?" required className="h-14 rounded-2xl bg-foreground/[0.02] border-border focus:ring-foreground/20" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Description (Optional)</label>
                <Input name="description" placeholder="Add some context..." className="h-14 rounded-2xl bg-foreground/[0.02] border-border focus:ring-foreground/20" />
              </div>

              <div className="space-y-4 pt-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex justify-between items-center ml-1">
                  <span>Poll Options</span>
                  <span className="text-[10px]">{options.length}/10</span>
                </label>
                
                <AnimatePresence>
                  {options.map((option, index) => (
                    <motion.div 
                      key={option.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 items-center group"
                    >
                      <div className="w-10 flex-shrink-0 text-center text-[10px] font-black text-foreground/20 group-hover:text-foreground transition-colors uppercase">
                        {index + 1}.
                      </div>
                      <Input 
                        name={`option-${option.id}`} 
                        placeholder={`Option ${index + 1}`} 
                        required 
                        className="flex-1 h-14 rounded-2xl bg-foreground/[0.02] border-border"
                      />
                      {options.length > 2 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="px-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                          onClick={() => handleRemoveOption(option.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {options.length < 10 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed py-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground hover:border-foreground/40 transition-all bg-foreground/[0.01]"
                  onClick={handleAddOption}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add another option
                </Button>
              )}

              <div className="flex flex-col gap-6 pt-6">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input type="checkbox" name="hasOtherOption" value="true" className="w-6 h-6 rounded-lg border-foreground/20 bg-foreground/5 text-foreground focus:ring-foreground accent-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:opacity-100 opacity-60 transition-opacity">Add "Other" option</span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group pt-6 border-t border-border">
                  <input type="checkbox" name="allowMultipleVotes" value="true" className="w-6 h-6 rounded-lg border-foreground/20 bg-foreground/5 text-foreground focus:ring-foreground accent-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:opacity-100 opacity-60 transition-opacity">Allow multiple votes per person</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-between h-14 rounded-2xl bg-foreground/[0.03] hover:bg-foreground/[0.06] px-6"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <Settings2 className="w-4 h-4" />
                    Advanced Controls
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                </Button>
                
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-8 pt-10 pb-4 px-2">
                        <SettingToggle name="requireNames" title="Require names" desc="Voters must identify themselves" />
                        <SettingToggle name="allowComments" title="Allow comments" desc="Enable the public discussion board" />
                        <SettingToggle name="hideShareButton" title="Stealth Mode" desc="Hide share icons from participants" />
                        <SettingToggle name="anonymizeData" title="Anonymize IP" desc="Fully encrypt participant footprints" />

                        <div className="pt-6 border-t border-border">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-4 ml-1">Results Visibility</label>
                          <select 
                            name="resultsVisibility" 
                            className="w-full h-14 px-5 rounded-2xl border border-border bg-background text-foreground text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer appearance-none shadow-sm"
                          >
                            <option value="PUBLIC">Always public</option>
                            <option value="ADMIN_ONLY">Admin only</option>
                            <option value="HIDDEN">Nobody (Hidden)</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 h-16 bg-foreground text-background hover:opacity-90 rounded-2xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-foreground/20"
                isLoading={isSubmitting}
              >
                Create your Poll <ArrowRight className="w-5 h-5 ml-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function SettingToggle({ name, title, desc }: { name: string; title: string; desc: string }) {
  return (
    <label className="flex items-center gap-5 cursor-pointer group">
      <input 
        type="checkbox" 
        name={name} 
        value="true" 
        className="w-6 h-6 rounded-lg border-foreground/20 bg-foreground/5 text-foreground focus:ring-foreground accent-foreground" 
      />
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-foreground group-hover:opacity-100 opacity-60 transition-opacity italic">{title}</span>
        <span className="text-[11px] font-black uppercase tracking-tight text-foreground/40 italic">{desc}</span>
      </div>
    </label>
  );
}
