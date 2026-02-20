"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Flag,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  History,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { Goal } from "@/components/overlay/Goal";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const singleGoalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  targetAmount: z.number().min(1, "Target amount must be at least 1"),
  currentAmount: z.number().min(0, "Current amount cannot be negative"),
  iconUrl: z.string().optional(),
  isActive: z.boolean(),
  showAmounts: z.boolean(),
});

const goalListSchema = z.object({
  goals: z.array(singleGoalSchema),
});

type GoalFormValues = z.infer<typeof goalListSchema>;

export default function GoalOverlaySettingsPage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalListSchema),
    defaultValues: {
      goals: [
        {
          id: "1",
          title: "Februari Subathon",
          targetAmount: 10000000,
          currentAmount: 7500000,
          iconUrl: "",
          isActive: true,
          showAmounts: true,
        },
        {
          id: "2",
          title: "Upgrade GPU",
          targetAmount: 15000000,
          currentAmount: 2000000,
          iconUrl: "",
          isActive: false,
          showAmounts: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "goals",
  });

  const goals = watch("goals");
  const activeGoal = goals.find((g) => g.isActive) || goals[0];

  const handleToggleActive = (index: number) => {
    // Set all goals to inactive first
    goals.forEach((_, i) => setValue(`goals.${i}.isActive`, false));
    // Set the selected one to active
    setValue(`goals.${index}.isActive`, true);
  };

  const handleIconUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setValue(`goals.${index}.iconUrl`, url);
    }
  };

  const addNewGoal = () => {
    append({
      id: Math.random().toString(36).substr(2, 9),
      title: "New Goal",
      targetAmount: 1000000,
      currentAmount: 0,
      iconUrl: "",
      isActive: goals.length === 0,
      showAmounts: true,
    });
  };

  const onSubmit = (data: GoalFormValues) => {
    console.log("Saving goal list:", data);
    alert("Goal list updated successfully! (Mock)");
  };

  return (
    <OverlaySettingsTemplate
      title="Goals"
      description="Manage your donation targets."
      icon={<Flag size={20} />}
      type="goal"
      layout="stacked"
      previewContent={
        activeGoal ? (
          <Goal
            title={activeGoal.title}
            current={activeGoal.currentAmount}
            target={activeGoal.targetAmount}
            iconUrl={activeGoal.iconUrl}
            showAmounts={activeGoal.showAmounts}
          />
        ) : (
          <p className="text-slate-400 font-bold text-sm">No active goal selected.</p>
        )
      }
      settingsContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-purple-50/50 border border-purple-100/50 rounded-xl">
            <div className="flex items-center gap-2">
              <History className="text-[var(--color-deep-purple)]" size={14} />
              <span className="font-semibold text-[var(--color-deep-purple)] text-[10px] uppercase tracking-wider">
                Goal Management
              </span>
            </div>
            <Button
              type="button"
              onClick={addNewGoal}
              size="sm"
              className="bg-[var(--color-deep-purple)] text-white gap-2 hover:bg-black h-7 rounded-lg px-3 text-[11px] font-semibold shadow-sm shadow-purple-200"
            >
              <Plus size={12} /> New Goal
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => {
              const isActive = goals[index]?.isActive;
              return (
                <Card
                  key={field.id}
                  className={cn(
                    "p-4 border transition-all relative overflow-hidden group",
                    isActive
                      ? "border-[var(--color-primary)] shadow-[0_10px_30px_rgba(253,224,71,0.15)] ring-1 ring-[var(--color-primary)]/20"
                      : "border-slate-100 hover:border-purple-100 hover:shadow-md"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-[var(--color-primary)] rotate-45 z-0 opacity-10" />
                  )}

                  <div className="flex items-start gap-4 relative z-10">
                    {/* Compact Icon Picker */}
                    <div className="relative shrink-0">
                      <label className="w-16 h-16 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-[var(--color-deep-purple)]/50 cursor-pointer group/icon relative block">
                        {goals[index]?.iconUrl ? (
                          <img
                            src={goals[index].iconUrl}
                            className="w-full h-full object-cover"
                            alt="icon"
                          />
                        ) : (
                          <ImageIcon className="text-slate-300" size={24} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleIconUpload(index, e)}
                          className="sr-only"
                        />
                        <div className="absolute inset-0 bg-[var(--color-deep-purple)]/60 opacity-0 group-hover/icon:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-semibold uppercase tracking-tighter">
                          Change
                        </div>
                      </label>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            {...register(`goals.${index}.title`)}
                            placeholder="Unnamed Goal"
                            className="w-full bg-transparent border-none p-0 text-[15px] font-semibold text-slate-800 focus:ring-0 placeholder:text-slate-300"
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--color-primary)] transition-all group-hover:w-24" />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setValue(`goals.${index}.showAmounts`, !goals[index].showAmounts)
                            }
                            className={cn(
                              "p-1.5 rounded-lg transition-all",
                              goals[index].showAmounts
                                ? "text-purple-600 bg-purple-50"
                                : "text-slate-300 bg-slate-50"
                            )}
                            title={goals[index].showAmounts ? "Hide Amounts" : "Show Amounts"}
                          >
                            {goals[index].showAmounts ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-slate-200 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1 h-3 bg-[var(--color-primary)] rounded-full" />{" "}
                            Target Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold">
                              Rp
                            </span>
                            <input
                              type="text"
                              value={goals[index]?.targetAmount?.toLocaleString("id-ID") ?? "0"}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                const numberValue = Number(value);
                                setValue(
                                  `goals.${index}.targetAmount`,
                                  isNaN(numberValue) ? 0 : numberValue
                                );
                              }}
                              className="w-full text-xs font-semibold border border-slate-100 bg-slate-50/50 rounded-xl py-2.5 pl-8 pr-3 focus:bg-white focus:border-[var(--color-deep-purple)]/30 focus:ring-4 focus:ring-purple-500/5 transition-all font-mono"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1 h-3 bg-slate-300 rounded-full" /> Current Amount
                            <span className="ml-auto text-[8px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md tracking-widest">
                              READ ONLY
                            </span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-300 font-bold">
                              Rp
                            </span>
                            <input
                              type="text"
                              readOnly
                              value={goals[index]?.currentAmount?.toLocaleString("id-ID") ?? "0"}
                              className="w-full text-xs font-semibold border border-slate-100 bg-slate-50 rounded-xl py-2.5 pl-8 pr-3 text-slate-400 cursor-not-allowed font-mono select-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 gap-3 border-t border-slate-50">
                        <div className="flex-1">
                          {isActive ? (
                            <div className="flex items-center gap-2 text-[var(--color-deep-purple)] font-semibold text-[10px] uppercase tracking-widest bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100/50 w-fit">
                              <CheckCircle2 size={12} className="text-[var(--color-primary)]" />{" "}
                              Active Goal
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleActive(index)}
                              className="text-slate-400 hover:text-[var(--color-deep-purple)] text-[10px] font-semibold uppercase tracking-widest hover:bg-purple-50 px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-purple-100/50"
                            >
                              Show on Overlay
                            </button>
                          )}
                        </div>
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-slate-900 hover:bg-black text-white font-semibold h-8 rounded-lg px-4 text-[11px] shadow-sm active:scale-95"
                        >
                          <Save size={12} className="mr-1.5" /> Save Goal
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </form>
      }
    />
  );
}
