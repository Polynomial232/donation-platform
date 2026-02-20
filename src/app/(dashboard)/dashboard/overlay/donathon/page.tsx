"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Clock,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  History,
  Edit3,
  Calendar,
  Timer,
  Target,
  Zap,
  Type,
  AlignLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { Donathon } from "@/components/overlay/Donathon";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const donathonRuleSchema = z.object({
  amount: z.number().min(1, "Amount is required"),
  timeLabel: z.string().min(1, "Time label is required"),
});

const donathonProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  currentMinutes: z.number().min(1, "Base duration is required"),
  targetAmount: z.number().min(1, "Target amount is required"),
  currentAmount: z.number().min(0).optional(),
  rules: z.array(donathonRuleSchema).min(1, "At least one rule is required"),
  isActive: z.boolean(),
  createdAt: z.string(),
  showAmounts: z.boolean(),
});

const donathonConfigSchema = z.object({
  // Global Settings (Labels ONLY)
  globalGoalTitle: z.string().min(1, "Goal title is required"),
  globalRulesDescription: z.string().min(1, "Rules description is required"),
  globalBadgeText: z.string().min(1, "Badge text is required"),
  globalCollectedLabel: z.string().min(1, "Collected label is required"),
  // Historical Sessions (Data is here)
  projects: z.array(donathonProjectSchema),
});

type DonathonFormValues = z.infer<typeof donathonConfigSchema>;
type DonathonProject = z.infer<typeof donathonProjectSchema>;

export default function DonathonOverlaySettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentProgress] = useState(1250000); // Mock current progress
  const [manualTimeAdjustment, setManualTimeAdjustment] = useState(0); // in milliseconds
  const [previewStartTime] = useState(Date.now());
  const [customTimeValue, setCustomTimeValue] = useState<number>(5);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonathonFormValues>({
    resolver: zodResolver(donathonConfigSchema),
    defaultValues: {
      globalGoalTitle: "Donation Goal",
      globalRulesDescription: "Server Rules & Rates",
      globalBadgeText: "DONATHON LIVE!",
      globalCollectedLabel: "Collected:",
      projects: [
        {
          id: "1",
          title: "Ramadan Charity Stream",
          currentMinutes: 120,
          targetAmount: 5000000,
          currentAmount: 3200000,
          isActive: true,
          createdAt: "2024-02-15",
          showAmounts: true,
          rules: [
            { amount: 10000, timeLabel: "1 Menit" },
            { amount: 50000, timeLabel: "6 Menit" },
            { amount: 100000, timeLabel: "15 Menit" },
          ],
        },
        {
          id: "2",
          title: "Setup Upgrade Donathon",
          currentMinutes: 60,
          targetAmount: 10000000,
          currentAmount: 0,
          isActive: false,
          createdAt: "2024-01-20",
          showAmounts: true,
          rules: [
            { amount: 25000, timeLabel: "2 Menit" },
            { amount: 100000, timeLabel: "10 Menit" },
          ],
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "projects",
  });

  const formData = watch();
  const projects = formData.projects;
  const activeProject = projects.find((p) => p.isActive);

  // Local state for the Modal (History + Data)
  const [tempProject, setTempProject] = useState<Partial<DonathonProject>>({
    title: "",
    currentMinutes: 60,
    targetAmount: 1000000,
    currentAmount: 0,
    rules: [{ amount: 10000, timeLabel: "1 Menit" }],
    showAmounts: true,
  });

  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setTempProject({
      title: "",
      currentMinutes: 60,
      targetAmount: 1000000,
      currentAmount: 0,
      rules: [{ amount: 10000, timeLabel: "1 Menit" }],
      showAmounts: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (index: number) => {
    setEditingIndex(index);
    setTempProject(JSON.parse(JSON.stringify(projects[index])));
    setIsModalOpen(true);
  };

  const handleAddRuleInModal = () => {
    setTempProject({
      ...tempProject,
      rules: [...(tempProject.rules || []), { amount: 0, timeLabel: "" }],
    });
  };

  const handleRemoveRuleInModal = (ruleIndex: number) => {
    const newRules = [...(tempProject.rules || [])];
    newRules.splice(ruleIndex, 1);
    setTempProject({ ...tempProject, rules: newRules });
  };

  const handleUpdateRuleInModal = (
    ruleIndex: number,
    field: "amount" | "timeLabel",
    value: string | number
  ) => {
    const newRules = [...(tempProject.rules || [])];
    newRules[ruleIndex] = { ...newRules[ruleIndex], [field]: value };
    setTempProject({ ...tempProject, rules: newRules });
  };

  const handleSaveProject = () => {
    if (!tempProject.title || !tempProject.rules || tempProject.rules.length === 0) return;

    if (editingIndex !== null) {
      update(editingIndex, {
        ...projects[editingIndex],
        ...tempProject,
      } as DonathonProject);
    } else {
      append({
        id: Math.random().toString(36).substr(2, 9),
        title: tempProject.title!,
        currentMinutes: tempProject.currentMinutes || 60,
        targetAmount: tempProject.targetAmount || 1000000,
        rules: tempProject.rules as any,
        isActive: projects.length === 0,
        createdAt: new Date().toISOString().split("T")[0],
        showAmounts: tempProject.showAmounts ?? true,
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (index: number) => {
    projects.forEach((_, i) => setValue(`projects.${i}.isActive`, false));
    setValue(`projects.${index}.isActive`, true);
  };

  const handleAdjustTime = (minutes: number) => {
    setManualTimeAdjustment((prev) => prev + minutes * 60 * 1000);
  };

  const handleSaveTimer = () => {
    alert(`Timer adjustment of ${manualTimeAdjustment / 60000}m saved successfully!`);
  };

  const onSubmit = (data: DonathonFormValues) => {
    console.log("Saving Donathon Configuration:", data);
    alert("Donathon settings updated successfully!");
  };

  return (
    <OverlaySettingsTemplate
      title="Donathon"
      description="Customize your Donathon labels and manage specific session data."
      icon={<Clock size={24} />}
      type="donathon"
      layout="stacked"
      previewContent={
        activeProject ? (
          <Donathon
            startTime={previewStartTime}
            endTime={
              previewStartTime + activeProject.currentMinutes * 60 * 1000 + manualTimeAdjustment
            }
            goalProgress={{
              current: currentProgress,
              target: activeProject.targetAmount,
            }}
            goalTitle={formData.globalGoalTitle}
            rulesDescription={formData.globalRulesDescription}
            badgeText={formData.globalBadgeText}
            collectedLabel={formData.globalCollectedLabel}
            showAmounts={activeProject.showAmounts}
            rules={activeProject.rules.map((r) => ({
              amount: r.amount.toLocaleString("id-ID"),
              time: r.timeLabel,
            }))}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Timer size={48} className="opacity-20" />
            <p className="font-bold text-sm">No active session selected.</p>
          </div>
        )
      }
      settingsContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Live Timer Controls Section */}
          {activeProject && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-[var(--color-deep-purple)]">
                <Clock size={18} />
                <h3 className="text-sm font-black uppercase tracking-wider">Live Timer Actions</h3>
              </div>
              <Card className="p-6 border-[var(--color-deep-purple)]/20 bg-purple-50/30 flex flex-wrap items-center gap-4">
                <div className="flex flex-col gap-1 mr-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Adjust Active Timer
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    Manual offset: {manualTimeAdjustment / 60000} Minutes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-28">
                    <input
                      type="number"
                      value={customTimeValue}
                      onChange={(e) => setCustomTimeValue(Number(e.target.value))}
                      className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-bold focus:border-purple-300 outline-none transition-all pr-12"
                      placeholder="Min"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">
                      Min
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdjustTime(-customTimeValue)}
                    className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="rotate-45" size={14} /> Subtract
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustTime(customTimeValue)}
                    className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-purple-50 hover:text-purple-600 hover:border-purple-100 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Plus size={14} /> Add Time
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTimer}
                    className="h-10 px-4 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all shadow-md flex items-center gap-2"
                  >
                    <CheckCircle2 size={14} /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualTimeAdjustment(0)}
                    className="h-10 px-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs hover:bg-slate-200 transition-all ml-auto"
                  >
                    Reset
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* Global Configuration Section (LABELS ONLY) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Zap size={18} className="text-yellow-500 fill-yellow-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Global Configuration
              </h3>
            </div>

            <Card className="p-8 border-slate-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Type size={12} className="text-purple-400" /> Goal Title Text
                  </label>
                  <input
                    type="text"
                    {...register("globalGoalTitle")}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white outline-none transition-all"
                    placeholder="e.g. Donation Goal"
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic pl-1">
                    This text appears above the goal bar in all sessions.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft size={12} className="text-blue-400" /> Rules Title Text
                  </label>
                  <input
                    type="text"
                    {...register("globalRulesDescription")}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white outline-none transition-all"
                    placeholder="e.g. Server Rules & Rates"
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic pl-1">
                    This text appears above the rules table in all sessions.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={12} className="text-yellow-500" /> Badge Text (Live)
                  </label>
                  <input
                    type="text"
                    {...register("globalBadgeText")}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white outline-none transition-all"
                    placeholder="e.g. DONATHON LIVE!"
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic pl-1">
                    The moving tag at the top-left of the overlay.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={12} className="text-green-400" /> Collected Label
                  </label>
                  <input
                    type="text"
                    {...register("globalCollectedLabel")}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white outline-none transition-all"
                    placeholder="e.g. Collected:"
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic pl-1">
                    Label shown before the collected donation amount.
                  </p>
                </div>
                <div className="md:col-span-2 pt-6 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-slate-900 hover:bg-black text-white font-black h-12 rounded-2xl px-10 text-[11px] shadow-xl shadow-slate-200/80 active:scale-95 transition-all flex gap-2.5 uppercase tracking-widest"
                  >
                    <Save size={16} /> Save Configuration
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Session History Section (DATA HERE) */}
          <div className="space-y-5">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <History size={18} className="text-purple-500" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Session History
                </h3>
              </div>
              <Button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-[var(--color-deep-purple)] hover:bg-black text-white gap-2 h-10 rounded-2xl px-5 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/10 active:scale-95 transition-all"
              >
                <Plus size={16} /> New Session
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {fields.map((field, index) => {
                const project = projects[index];
                const isActive = project?.isActive;

                return (
                  <Card
                    key={field.id}
                    className={cn(
                      "p-6 border-2 transition-all relative overflow-hidden group flex flex-col justify-between h-[260px]",
                      isActive
                        ? "border-[var(--color-deep-purple)] bg-white shadow-2xl shadow-purple-900/5 ring-1 ring-purple-50"
                        : "border-slate-100 bg-slate-50/50 opacity-80 hover:opacity-100 grayscale-[0.3] hover:grayscale-0 shadow-sm"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                          isActive
                            ? "bg-[var(--color-deep-purple)] text-white"
                            : "bg-slate-200 text-slate-500"
                        )}
                      >
                        {isActive ? (
                          <>
                            {" "}
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> Active
                            Session{" "}
                          </>
                        ) : (
                          "Inactive"
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() =>
                              setValue(`projects.${index}.showAmounts`, !project.showAmounts)
                            }
                            className={cn(
                              "p-1.5 rounded-lg transition-all",
                              project.showAmounts
                                ? "text-purple-600 bg-purple-50"
                                : "text-slate-300 bg-slate-50"
                            )}
                            title={project.showAmounts ? "Hide Amounts" : "Show Amounts"}
                          >
                            {project.showAmounts ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(index)}
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 space-y-2">
                      <h4
                        className={cn(
                          "text-lg font-black truncate",
                          isActive ? "text-[var(--color-deep-purple)]" : "text-slate-600"
                        )}
                      >
                        {project?.title}
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">
                            {project?.createdAt}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-yellow-600">
                          <Target size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">
                            Rp {project?.targetAmount.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                      {/* Current Amount Readonly */}
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">
                          Rp
                        </span>
                        <input
                          type="text"
                          readOnly
                          value={(project?.currentAmount ?? 0).toLocaleString("id-ID")}
                          className="w-full text-[11px] font-bold border border-slate-100 bg-slate-50 rounded-xl py-1.5 pl-7 pr-3 text-slate-400 cursor-not-allowed font-mono select-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                          Current
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center relative z-10">
                      <div className="text-[10px] font-bold text-slate-400 tracking-wide">
                        Click check to activate
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(index)}
                        className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90",
                          isActive
                            ? "bg-purple-100 text-[var(--color-deep-purple)] border border-purple-200"
                            : "bg-white text-slate-300 border border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <CheckCircle2 size={22} />
                      </button>
                    </div>

                    <div
                      className={cn(
                        "absolute -bottom-8 -right-8 w-32 h-32 rotate-12 opacity-[0.03] transition-transform group-hover:scale-110",
                        isActive ? "text-[var(--color-deep-purple)]" : "text-slate-900"
                      )}
                    >
                      <Clock size={128} />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </form>
      }
    >
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? "Edit Session Details" : "New Donathon Session"}
        className="max-w-2xl"
      >
        <div className="space-y-8 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Type size={12} /> Session Title
              </label>
              <input
                type="text"
                placeholder="e.g. 24 Hour Stream"
                value={tempProject.title}
                onChange={(e) => setTempProject({ ...tempProject, title: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={12} className="text-slate-300" /> Current Amount
                <span className="ml-auto text-[8px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md tracking-widest">
                  READ ONLY
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">
                  Rp
                </span>
                <input
                  type="text"
                  readOnly
                  value={(tempProject.currentAmount ?? 0).toLocaleString("id-ID")}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-10 text-sm font-bold text-slate-400 cursor-not-allowed font-mono select-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Timer size={12} className="text-slate-300" /> Current Time (m)
                  <span className="ml-auto text-[8px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md tracking-widest">
                    READ ONLY
                  </span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={tempProject.currentMinutes}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-400 cursor-not-allowed font-mono select-none"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Target size={12} /> Goal (Rp)
                </label>
                <input
                  type="number"
                  value={tempProject.targetAmount}
                  onChange={(e) =>
                    setTempProject({ ...tempProject, targetAmount: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Visibility Controls in Modal */}
          {/* DO NOT CHANGE! */}
          {/* <button
                        type="button"
                        onClick={() => setTempProject({ ...tempProject, showAmounts: !tempProject.showAmounts })}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest",
                            tempProject.showAmounts ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-100 text-slate-400"
                        )}
                    >
                        {tempProject.showAmounts ? <Eye size={16} /> : <EyeOff size={16} />}
                        Amounts {tempProject.showAmounts ? "Visible" : "Hidden"}
                    </button> */}

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border-2 border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Session Rates (Extension Rules)
              </label>
              <button
                type="button"
                onClick={handleAddRuleInModal}
                className="text-[10px] font-black text-[var(--color-deep-purple)] hover:text-black uppercase tracking-wider flex items-center gap-1"
              >
                <Plus size={12} /> Add Rule
              </button>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
              {tempProject.rules?.map((rule, rIdx) => (
                <div
                  key={rIdx}
                  className="flex gap-4 items-center bg-white border-2 border-slate-100 p-3 rounded-2xl animate-in slide-in-from-left-2 duration-200"
                >
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={rule.amount || ""}
                      onChange={(e) =>
                        handleUpdateRuleInModal(rIdx, "amount", Number(e.target.value))
                      }
                      className="w-full bg-slate-50 border-none rounded-xl p-3 pl-8 text-xs font-bold outline-none ring-0"
                    />
                  </div>
                  <div className="text-slate-200">
                    <Zap size={14} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="e.g. 5 Menit"
                      value={rule.timeLabel}
                      onChange={(e) => handleUpdateRuleInModal(rIdx, "timeLabel", e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold outline-none ring-0"
                    />
                  </div>
                  {tempProject.rules!.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRuleInModal(rIdx)}
                      className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              className="flex-1 h-14 rounded-2xl font-black border-2 text-xs uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveProject}
              className="flex-1 h-14 rounded-2xl font-black bg-[var(--color-deep-purple)] text-white hover:bg-black transition-all shadow-xl shadow-purple-200 text-xs uppercase tracking-widest"
            >
              {editingIndex !== null ? "Update Session" : "Create Session"}
            </Button>
          </div>
        </div>
      </Modal>
    </OverlaySettingsTemplate>
  );
}
