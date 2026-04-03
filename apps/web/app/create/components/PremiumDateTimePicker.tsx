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
  
  const dateRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  // Close loops when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
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
    setShowDatePicker(false);

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
        setShowTimePicker(false);
        return;
      }
    }
    setExpireTime(timeStr);
    setShowTimePicker(false);
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
    <div className="flex flex-col sm:flex-row gap-4 pt-6 items-start">
      {/* Date Trigger */}
      <div className="relative flex-1" ref={dateRef}>
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

        <AnimatePresence>
          {showDatePicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 w-full bg-foreground/[0.02] border border-border rounded-[2rem] p-5 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <Button type="button" variant="ghost" size="sm" className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 p-0" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
                  <ChevronLeft className="w-4 h-4 mx-auto" />
                </Button>
                <div className="text-xs font-black uppercase tracking-widest">{currentMonthName} {viewDate.getFullYear()}</div>
                <Button type="button" variant="ghost" size="sm" className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 p-0" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
                  <ChevronRight className="w-4 h-4 mx-auto" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                  <div key={d} className="text-[9px] font-black uppercase tracking-widest text-foreground/30">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateDays().map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={d ? getLocalDateString(d) < localToday : true}
                    onClick={() => d && handleDateSelect(d)}
                    className={`h-8 rounded-xl text-xs flex items-center justify-center transition-all ${getDayClass(d)}`}
                  >
                    {d?.getDate()}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Time Trigger */}
      <div className="relative flex-1" ref={timeRef}>
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
              {expireTime || "Pick Time"}
            </span>
          </div>
        </button>

        <AnimatePresence>
          {showTimePicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 w-full bg-foreground/[0.02] border border-border rounded-[2rem] p-5 overflow-hidden"
            >
               <div className="text-center text-xs font-black uppercase tracking-widest mb-6">Select Time</div>
               
               <div className="flex gap-4 h-48 relative">
                 {/* Current safe limits */}
                 {(() => {
                   let minHour = "00";
                   let minMin = "00";
                   if (!expireDate || expireDate === localToday) {
                     const now = new Date();
                     minHour = now.getHours().toString().padStart(2, '0');
                     minMin = now.getMinutes().toString().padStart(2, '0');
                   }

                   return (
                     <>
                        <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-xl bg-foreground/[0.02] scrollbar-hide snap-y">
                          <div className="py-20 text-center text-[10px] tracking-widest font-black text-foreground/20 uppercase">Hours</div>
                          {hours.map(h => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => {
                                const m = expireTime ? expireTime.split(":")[1] || "00" : "00";
                                handleTimeSelect(h, m);
                              }}
                              disabled={h < minHour && expireDate === localToday}
                              className={`w-full py-3 snap-center text-lg font-black transition-all rounded-lg 
                                ${h < minHour && expireDate === localToday ? "text-foreground/20 line-through cursor-not-allowed" : 
                                expireTime?.startsWith(h + ":") ? "bg-foreground text-background scale-110" : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground hover:scale-105"}`}
                            >
                              {h}
                            </button>
                          ))}
                          <div className="py-20"></div>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-xl bg-foreground/[0.02] scrollbar-hide snap-y">
                          <div className="py-20 text-center text-[10px] tracking-widest font-black text-foreground/20 uppercase">Mins</div>
                          {minutes.map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                const h = expireTime ? expireTime.split(":")[0] || minHour : minHour;
                                handleTimeSelect(h, m);
                              }}
                              disabled={expireTime?.split(":")[0] === minHour && m < minMin && expireDate === localToday}
                              className={`w-full py-3 snap-center text-lg font-black transition-all rounded-lg 
                                ${(expireTime?.split(":")[0] || minHour) === minHour && m < minMin && expireDate === localToday ? "text-foreground/20 line-through cursor-not-allowed" : 
                                expireTime?.endsWith(":" + m) ? "bg-foreground text-background scale-110" : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground hover:scale-105"}`}
                            >
                              {m}
                            </button>
                          ))}
                          <div className="py-20"></div>
                        </div>
                     </>
                   )
                 })()}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
