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
    <div className="min-h-screen py-20 px-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {!session && (
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Temporary Access</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                You're creating this poll anonymously. Your control over this poll is temporary and linked to this browser only. 
                <Link href="/signin" className="text-white hover:underline ml-1">Sign in</Link> to save it to your account.
              </p>
            </div>
          </div>
        )}
        <Card className="glass border-border shadow-2xl overflow-hidden relative">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-border" />
          
          <CardHeader>
            <CardTitle>Create a new Poll</CardTitle>
            <CardDescription className="text-foreground/70">Complete the details below to generate your shareable link.</CardDescription>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Poll Title Question</label>
                <Input name="title" placeholder="e.g. What is your favorite framework?" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description (Optional)</label>
                <Input name="description" placeholder="Add some context..." />
              </div>

              <div className="space-y-3 pt-4">
                <label className="text-sm font-medium text-foreground flex justify-between items-center">
                  <span>Options</span>
                  <span className="text-xs text-foreground/60">{options.length}/10</span>
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
                      <div className="w-8 flex-shrink-0 text-center text-sm font-bold text-foreground/40 group-hover:text-foreground transition-colors">
                        {index + 1}.
                      </div>
                      <Input 
                        name={`option-${option.id}`} 
                        placeholder={`Option ${index + 1}`} 
                        required 
                        className="flex-1"
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
                  className="w-full border-dashed py-6 text-foreground/70 hover:text-foreground"
                  onClick={handleAddOption}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add another option
                </Button>
              )}

              <div className="flex items-center justify-between pt-4 pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="hasOtherOption" value="true" className="w-5 h-5 rounded border-foreground/20 bg-foreground/5 text-foreground focus:ring-foreground focus:ring-offset-background" />
                  <span className="text-sm font-medium text-foreground">Add "Other" option</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="allowMultipleVotes" value="true" className="w-5 h-5 rounded border-foreground/20 bg-foreground/5 text-foreground focus:ring-foreground focus:ring-offset-background" />
                  <span className="text-sm font-medium text-foreground">Allow multiple votes per person</span>
                </label>
              </div>

              <div className="pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-between font-normal hover:bg-foreground/5"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Advanced Settings
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
                      <div className="space-y-4 pt-4 pb-2 px-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" name="requireNames" value="true" className="w-5 h-5 rounded border-foreground/20 bg-foreground/5 text-foreground flex-shrink-0 mt-0.5 self-start" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">Require participant names</span>
                            <span className="text-xs text-foreground/60">Voters must enter their name to submit a vote.</span>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" name="allowComments" value="true" className="w-5 h-5 rounded border-foreground/20 bg-foreground/5 text-foreground flex-shrink-0 mt-0.5 self-start" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">Allow comments</span>
                            <span className="text-xs text-foreground/60">Enable a discussion section on the poll page.</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" name="hideShareButton" value="true" className="w-5 h-5 rounded border-foreground/20 bg-foreground/5 text-foreground flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">Hide share button</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" name="anonymizeData" value="true" className="w-5 h-5 rounded border-foreground/20 bg-foreground/5 text-foreground flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">Anonymize voter data</span>
                            <span className="text-xs text-foreground/60">Hide voter IP footprints from admin exports.</span>
                          </div>
                        </label>

                        <div className="pt-2">
                          <label className="text-sm font-medium text-foreground block mb-2">Results Visibility</label>
                          <select 
                            name="resultsVisibility" 
                            className="w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer appearance-none"
                            style={{ color: 'inherit' }}
                          >
                            <option value="PUBLIC" className="bg-background text-foreground">Always public</option>
                            <option value="ADMIN_ONLY" className="bg-background text-foreground">Admin only</option>
                            <option value="HIDDEN" className="bg-background text-foreground">Nobody (Hidden)</option>
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
                className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90 border-0"
                isLoading={isSubmitting}
              >
                Create your Poll <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
