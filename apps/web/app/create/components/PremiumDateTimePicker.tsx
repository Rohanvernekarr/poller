"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@repo/ui/button";

interface PremiumDateTimePickerProps {
  expireDate: string;
  setExpireDate: (date: string) => void;
  expireTime: string;
  setExpireTime: (time: string) => void;
}

export function PremiumDateTimePicker({ expireDate, setExpireDate, expireTime, setExpireTime }: PremiumDateTimePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close loops when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
        setShowTimePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLocalDateString = (d: Date) => {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const localToday = getLocalDateString(new Date());

  // Generate Calendar Days
  const generateDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  const handleDateSelect = (d: Date) => {
    const ds = getLocalDateString(d);
    setExpireDate(ds);

    // Dynamic Time Snapping protection exactly like before
    if (ds === localToday && expireTime) {
      const now = new Date();
      const currentHrMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      if (expireTime < currentHrMin) {
        setExpireTime(currentHrMin);
      }
    }
  };

  const handleTimeSelect = (h: string, m: string) => {
    const timeStr = `${h}:${m}`;
    
    if (!expireDate || expireDate === localToday) {
      const now = new Date();
      const currentHrMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      if (timeStr < currentHrMin) {
        setExpireTime(currentHrMin);
        return;
      }
    }
    setExpireTime(timeStr);
  };

  // Helper to format stored 24hr time perfectly
  const getDisplayTime = (time24: string | undefined) => {
    if (!time24) return "Pick Time";
    const [h, m] = time24.split(":") as [string, string];
    let hr12 = parseInt(h) % 12 || 12;
    const ampm = parseInt(h) >= 12 ? "PM" : "AM";
    return `${hr12}:${m} ${ampm}`;
  };

  const currentMonthName = viewDate.toLocaleString("default", { month: "long" });

  const getDayClass = (d: Date | null) => {
    if (!d) return "invisible";
    const ds = getLocalDateString(d);
    if (ds < localToday) return "text-foreground/20 cursor-not-allowed line-through hover:bg-transparent";
    if (ds === expireDate) return "bg-foreground text-background font-black shadow-xl";
    return "text-foreground font-bold hover:bg-foreground/10 cursor-pointer";
  };

  return (
    <div className="pt-6 relative" ref={containerRef}>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Date Trigger */}
        <div className="relative flex-1 w-full">
          <button
            type="button"
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setShowTimePicker(false);
            }}
            className={`w-full h-16 rounded-[2rem] bg-foreground/[0.03] border-2 transition-all flex items-center px-6 gap-4 hover:bg-foreground/[0.05] ${showDatePicker ? "border-foreground/20 shadow-lg" : "border-transparent"}`}
          >
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-none mb-1">Set Date</span>
              <span className={`text-sm font-black uppercase tracking-widest leading-none ${expireDate ? "text-foreground" : "text-foreground/20"}`}>
                {expireDate ? new Date(expireDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Pick Date"}
              </span>
            </div>
          </button>
        </div>

        {/* Time Trigger */}
        <div className="relative flex-1 w-full">
          <button
            type="button"
            onClick={() => {
              setShowTimePicker(!showTimePicker);
              setShowDatePicker(false);
            }}
            className={`w-full h-16 rounded-[2rem] bg-foreground/[0.03] border-2 transition-all flex items-center px-6 gap-4 hover:bg-foreground/[0.05] ${showTimePicker ? "border-foreground/20 shadow-lg" : "border-transparent"}`}
          >
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-none mb-1">Set Time</span>
              <span className={`text-sm font-black uppercase tracking-widest leading-none ${expireTime ? "text-foreground" : "text-foreground/20"}`}>
                {getDisplayTime(expireTime)}
              </span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDatePicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 w-full max-w-[280px] sm:max-w-xs mx-auto bg-foreground/[0.02] border border-border rounded-3xl p-5 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-5">
              <Button type="button" variant="ghost" size="sm" className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 p-0" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
                <ChevronLeft className="w-4 h-4 mx-auto" />
              </Button>
              <div className="text-[11px] font-black uppercase tracking-widest">{currentMonthName} {viewDate.getFullYear()}</div>
              <Button type="button" variant="ghost" size="sm" className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 p-0" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
                <ChevronRight className="w-4 h-4 mx-auto" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} className="text-[8px] font-black uppercase tracking-widest text-foreground/30">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mb-5">
              {generateDays().map((d, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={d ? getLocalDateString(d) < localToday : true}
                  onClick={() => d && handleDateSelect(d)}
                  className={`h-8 w-8 mx-auto rounded-full text-xs flex items-center justify-center transition-all ${getDayClass(d)}`}
                >
                  {d?.getDate()}
                </button>
              ))}
            </div>
            
            <Button type="button" onClick={() => setShowDatePicker(false)} className="w-full rounded-2xl bg-foreground text-background font-black uppercase tracking-widest h-10 text-[10px] hover:scale-[0.98] transition-transform">
              Confirm Date
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTimePicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 w-full max-w-[320px] sm:max-w-sm mx-auto bg-foreground/[0.02] border border-border rounded-3xl p-5 overflow-hidden"
            >
               <div className="text-center text-[10px] font-black uppercase tracking-widest mb-4">Select Time</div>
               
               {(() => {
                 const currentVal = expireTime || "12:00";
                 const [hRaw, mRaw] = currentVal.split(":") as [string, string];
                 const hr24 = parseInt(hRaw);
                 const minStr = mRaw;
                 const period = hr24 >= 12 ? "PM" : "AM";
                 const hr12Str = hr24 === 0 ? "12" : (hr24 > 12 ? hr24 - 12 : hr24).toString();

                 const updateTime = (newHr12: string, newMin: string, newPeriod: string) => {
                   let finalHr24 = parseInt(newHr12);
                   if (newPeriod === "PM" && finalHr24 < 12) finalHr24 += 12;
                   if (newPeriod === "AM" && finalHr24 === 12) finalHr24 = 0;
                   
                   const hStr = finalHr24.toString().padStart(2, '0');
                   handleTimeSelect(hStr, newMin);
                 };

                 return (
                   <div className="space-y-4">
                     {/* AM / PM Segmented Control */}
                     <div className="flex bg-foreground/5 p-1 rounded-[14px] w-full">
                       <button 
                         type="button"
                         onClick={() => updateTime(hr12Str, minStr, "AM")}
                         className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${period === "AM" ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"}`}
                       >
                         AM
                       </button>
                       <button 
                         type="button"
                         onClick={() => updateTime(hr12Str, minStr, "PM")}
                         className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${period === "PM" ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"}`}
                       >
                         PM
                       </button>
                     </div>

                     {/* Hours Grid */}
                     <div>
                       <div className="text-[8px] uppercase font-black tracking-widest text-foreground/40 mb-2 px-1">Hour</div>
                       <div className="grid grid-cols-6 gap-1">
                         {["1","2","3","4","5","6","7","8","9","10","11","12"].map(h => (
                           <button
                             key={h}
                             type="button"
                             onClick={() => updateTime(h, minStr, period)}
                             className={`h-10 flex items-center justify-center text-xs font-bold transition-all rounded-xl border ${hr12Str === h ? "bg-foreground text-background border-foreground shadow text-sm" : "border-transparent bg-foreground/[0.03] text-foreground/70 hover:bg-foreground/10"}`}
                           >
                             {h}
                           </button>
                         ))}
                       </div>
                     </div>

                     {/* Minutes Grid */}
                     <div>
                       <div className="text-[8px] uppercase font-black tracking-widest text-foreground/40 mb-2 px-1">Minute</div>
                       <div className="grid grid-cols-6 gap-1">
                         {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m => (
                           <button
                             key={m}
                             type="button"
                             onClick={() => updateTime(hr12Str, m, period)}
                             className={`h-10 flex items-center justify-center text-xs font-bold transition-all rounded-xl border ${minStr === m ? "bg-foreground text-background border-foreground shadow text-sm" : "border-transparent bg-foreground/[0.03] text-foreground/70 hover:bg-foreground/10"}`}
                           >
                             {m}
                           </button>
                         ))}
                       </div>
                     </div>
                     
                     <Button type="button" onClick={() => setShowTimePicker(false)} className="w-full rounded-2xl bg-foreground text-background font-black uppercase tracking-widest h-10 text-[10px] hover:scale-[0.98] transition-transform mt-2">
                       Confirm Time
                     </Button>
                   </div>
                 );
               })()}
            </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
}
