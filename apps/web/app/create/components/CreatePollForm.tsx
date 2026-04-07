"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Plus, Trash2, ArrowRight, Settings2, ChevronDown, AlertCircle, CalendarClock, Lock } from "lucide-react";
import { createPoll } from "../../utils/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { TechnicalBackButton } from "../../components/TechnicalBackButton";
import { useFormStatus } from "react-dom";
import { PremiumDateTimePicker } from "./PremiumDateTimePicker";

const getLocalDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
};

const getLocalTimeString = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export function CreatePollForm() {
  const { data: session } = useSession();
  const [options, setOptions] = useState([{ id: 1, text: "" }, { id: 2, text: "" }]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [requireAuth, setRequireAuth] = useState(false);
  const [enableExpiration, setEnableExpiration] = useState(false);
  
  // Date and Time State for Expiration validation
  const [expireDate, setExpireDate] = useState("");
  const [expireTime, setExpireTime] = useState("");

  const handleAddOption = () => {
    if (options.length >= 10) return;
    setOptions([...options, { id: Date.now(), text: "" }]);
  };

  const handleRemoveOption = (id: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((o) => o.id !== id));
  };

  return (
    <>
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
          
          <CardHeader className="space-y-6 pt-10 text-center pb-2">
            <CardTitle className="text-5xl font-black uppercase tracking-tight italic leading-none">Create New Poll</CardTitle>
            <CardDescription className="text-foreground/40 font-black uppercase tracking-widest text-[10px] max-w-sm mx-auto">Complete the details below to generate your shareable link.</CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                if (enableExpiration) {
                  if (!expireDate || !expireTime) {
                    e.preventDefault();
                    alert("Please set both a valid Date and Time for the expiration lock.");
                    return;
                  }
                  
                  // Use local timezone validation
                  const localToday = getLocalDateString();
                  if (expireDate === localToday) {
                    if (expireTime < getLocalTimeString()) {
                      e.preventDefault();
                      alert("Expiration time has already passed! Please select a time in the future.");
                      return;
                    }
                  } else if (expireDate < localToday) {
                    e.preventDefault();
                    alert("Expiration date cannot be in the past.");
                    return;
                  }
                }
              }}
              action={async (formData) => {
                if (enableExpiration) {
                  formData.append("expireDate", expireDate);
                  formData.append("expireTime", expireTime);
                } else {
                  formData.delete("expireDate");
                  formData.delete("expireTime");
                }
                try {
                  await createPoll(formData);
                } catch (e) {
                  if (e instanceof Error && (e.message === "NEXT_REDIRECT" || e.message === "NEXT_NOT_FOUND")) {
                    throw e;
                  }
                  alert(e instanceof Error ? e.message : "Error creating poll");
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
                         <SettingToggle name="requireAuth" title="Sign In Required" desc="Only registered users can vote" checked={requireAuth} onChange={(e) => setRequireAuth(e.target.checked)} />
                         <SettingToggle name="requireNames" title="Require names" desc="Voters must identify themselves" disabled={requireAuth} />
                         <SettingToggle name="allowComments" title="Allow comments" desc="Enable the public discussion board" />
                         <SettingToggle name="hideShareButton" title="Stealth Mode" desc="Hide share icons from participants" />
                         <SettingToggle name="anonymizeData" title="Anonymize IP" desc="Fully encrypt participant footprints" />

                         <div className="pt-2 border-t border-border">
                           <SettingToggle 
                             name="enableExpiration" 
                             title="Auto-Lock Expiration" 
                             desc="Automatically close this poll at a specified date and time" 
                             checked={enableExpiration}
                             onChange={(e) => setEnableExpiration(e.target.checked)}
                           />
                           
                           <AnimatePresence>
                             {enableExpiration && (
                               <motion.div 
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                 <PremiumDateTimePicker 
                                   expireDate={expireDate} 
                                   setExpireDate={setExpireDate} 
                                   expireTime={expireTime} 
                                   setExpireTime={setExpireTime} 
                                 />

                                 <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest flex items-start gap-2 max-w-[90%] leading-relaxed pt-3 ml-1">
                                   <CalendarClock className="w-3 h-3 mt-0.5" />
                                   If set, voting will automatically lock and seamlessly switch to "Results Only" at this exact time.
                                 </p>
                               </motion.div>
                             )}
                           </AnimatePresence>
                         </div>

                         <div className="pt-6 border-t border-border space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block ml-1">Allowed Domains (Optional)</label>
                           <Input 
                             name="allowedDomains" 
                             placeholder="e.g. @company.com, @university.edu"
                             className="h-14 rounded-2xl bg-foreground/[0.02] border-border focus:ring-foreground/20"
                           />
                           <p className="text-[12px] font-bold text-foreground/40 italic ml-1">Leave empty to allow anyone. Separate multiple domains with commas.</p>
                         </div>

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

              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      size="lg" 
      className="w-full mt-8 h-14 bg-foreground text-background hover:opacity-90 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl shadow-foreground/20 transition-all active:scale-[0.98]"
      isLoading={pending}
      disabled={pending}
    >
      {pending ? "Creating..." : (
        <span className="flex items-center gap-4">
          Create your Poll
          <ArrowRight className="w-5 h-5" />
        </span>
      )}
    </Button>
  );
}

function SettingToggle({ name, title, desc, checked, disabled, onChange }: { name: string; title: string; desc: string; checked?: boolean; disabled?: boolean; onChange?: (e: any) => void }) {
  return (
    <label className={`flex items-center gap-5 cursor-pointer group ${disabled ? "opacity-30 pointer-events-none grayscale" : ""}`}>
      <input 
        type="checkbox" 
        name={name} 
        value="true" 
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="w-6 h-6 rounded-lg border-foreground/20 bg-foreground/5 text-foreground focus:ring-foreground accent-foreground" 
      />
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-black uppercase tracking-widest text-foreground group-hover:opacity-100 opacity-60 transition-opacity italic">{title}</span>
        <span className="text-[11px] font-black uppercase tracking-tight text-foreground/60 italic">{desc}</span>
      </div>
    </label>
  );
}
