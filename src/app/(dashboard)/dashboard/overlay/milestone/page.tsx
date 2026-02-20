"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Target,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  History,
  Edit3,
  Trophy,
  Calendar,
  Layers,
  Type,
  AlignLeft,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import { Milestone } from "@/components/overlay/Milestone";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const milestoneStepSchema = z.object({
  label: z.string().min(1, "Step label is required"),
  value: z.number().min(1, "Target amount is required"),
});

const milestoneProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  steps: z.array(milestoneStepSchema).min(1, "At least one step is required"),
  isActive: z.boolean(),
  createdAt: z.string(),
  currentAmount: z.number().min(0).optional(),
});

const milestoneConfigSchema = z.object({
  // Global Settings (Labels ONLY)
  globalMilestoneTitle: z.string().min(1, "Milestone title is required"),
  globalTrackerSubtitle: z.string().min(1, "Tracker subtitle is required"),
  globalShowAmounts: z.boolean(),
  // Historical Projects (Data is here)
  projects: z.array(milestoneProjectSchema),
});

type MilestoneFormValues = z.infer<typeof milestoneConfigSchema>;
type MilestoneProject = z.infer<typeof milestoneProjectSchema>;

export default function MilestoneOverlaySettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentValue] = useState(7500000); // Mock current progress

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneConfigSchema),
    defaultValues: {
      globalMilestoneTitle: "Milestones",
      globalTrackerSubtitle: "Progress Tracker",
      globalShowAmounts: true,
      projects: [
        {
          id: "1",
          title: "Season 1: Early Access Quests",
          isActive: true,
          createdAt: "2024-02-01",
          currentAmount: 7500000,
          steps: [
            { label: "Community Discord", value: 1000000 },
            { label: "First Live Soundboard", value: 5000000 },
            { label: "Studio Lights Upgrade", value: 10000000 },
          ],
        },
        {
          id: "2",
          title: "PC Master Race Build",
          isActive: false,
          createdAt: "2024-01-15",
          currentAmount: 0,
          steps: [
            { label: "RTX 4090 GPU", value: 30000000 },
            { label: "Custom Water Loop", value: 45000000 },
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

  // Local state for the Modal (managing a single project and its steps)
  const [tempProject, setTempProject] = useState<Partial<MilestoneProject>>({
    title: "",
    steps: [{ label: "", value: 0 }],
  });

  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setTempProject({
      title: "",
      steps: [{ label: "", value: 0 }],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (index: number) => {
    setEditingIndex(index);
    setTempProject(JSON.parse(JSON.stringify(projects[index]))); // Deep copy
    setIsModalOpen(true);
  };

  const handleAddStepInModal = () => {
    setTempProject({
      ...tempProject,
      steps: [...(tempProject.steps || []), { label: "", value: 0 }],
    });
  };

  const handleRemoveStepInModal = (stepIndex: number) => {
    const newSteps = [...(tempProject.steps || [])];
    newSteps.splice(stepIndex, 1);
    setTempProject({ ...tempProject, steps: newSteps });
  };

  const handleUpdateStepInModal = (
    stepIndex: number,
    field: "label" | "value",
    value: string | number
  ) => {
    const newSteps = [...(tempProject.steps || [])];
    newSteps[stepIndex] = { ...newSteps[stepIndex], [field]: value };
    setTempProject({ ...tempProject, steps: newSteps });
  };

  const handleSaveProject = () => {
    if (!tempProject.title || !tempProject.steps || tempProject.steps.length === 0) return;

    if (editingIndex !== null) {
      update(editingIndex, {
        ...projects[editingIndex],
        title: tempProject.title,
        steps: tempProject.steps as any,
      });
    } else {
      append({
        id: Math.random().toString(36).substr(2, 9),
        title: tempProject.title!,
        steps: tempProject.steps as any,
        isActive: projects.length === 0, // Set active if it's the first project
        createdAt: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (index: number) => {
    projects.forEach((_, i) => setValue(`projects.${i}.isActive`, false));
    setValue(`projects.${index}.isActive`, true);
  };

  const onSubmit = (data: MilestoneFormValues) => {
    console.log("Saving all milestone settings:", data);
    alert("Milestone configuration updated successfully!");
  };

  return (
    <OverlaySettingsTemplate
      title="Milestones"
      description="Create several milestone projects to track your progress through multiple goals."
      icon={<Target size={24} />}
      type="milestone"
      layout="stacked"
      previewContent={
        activeProject ? (
          <Milestone
            currentValue={currentValue}
            title={formData.globalMilestoneTitle}
            subtitle={formData.globalTrackerSubtitle}
            showAmounts={formData.globalShowAmounts}
            steps={activeProject.steps.map((s) => ({
              label: s.label,
              value: s.value,
              completed: currentValue >= s.value,
            }))}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Trophy size={48} className="opacity-20" />
            <p className="font-bold text-sm">No active milestone project selected.</p>
          </div>
        )
      }
      settingsContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Global Branding Configuration */}
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
                    <Type size={12} className="text-purple-400" /> Milestone Title Text
                  </label>
                  <input
                    type="text"
                    {...register("globalMilestoneTitle")}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white outline-none transition-all"
                    placeholder="e.g. Milestones"
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic pl-1">
                    Main header text for the milestone overlay.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft size={12} className="text-blue-400" /> Tracker Subtitle Text
                  </label>
                  <input
                    type="text"
                    {...register("globalTrackerSubtitle")}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white outline-none transition-all"
                    placeholder="e.g. Progress Tracker"
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic pl-1">
                    Smaller subtitle text appearing below the title.
                  </p>
                </div>

                {/* DO NOT CHANGE! */}
                {/* <div className="space-y-4 md:col-span-2 pt-4 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Amount Visibility
                      </label>
                      <p className="text-[11px] text-slate-500 font-medium">Toggle whether the current progress % and target amounts are visible on the overlay.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue("globalShowAmounts", !formData.globalShowAmounts)}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95",
                        formData.globalShowAmounts
                          ? "bg-emerald-500 text-white shadow-emerald-500/20"
                          : "bg-slate-100 text-slate-400 shadow-none border border-slate-200"
                      )}
                    >
                      {formData.globalShowAmounts ? (
                        <> <Eye size={16} /> Visible </>
                      ) : (
                        <> <EyeOff size={16} /> Hidden </>
                      )}
                    </button>
                  </div>
                </div> */}

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

          {/* History Section */}
          <div className="space-y-5">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <History size={18} className="text-purple-500" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Milestone History
                </h3>
              </div>
              <Button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-[var(--color-deep-purple)] hover:bg-black text-white gap-2 h-10 rounded-2xl px-5 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/10 active:scale-95 transition-all"
              >
                <Plus size={16} /> New Milestone Project
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
                      "p-6 border-2 transition-all relative overflow-hidden group flex flex-col justify-between h-[250px]",
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
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />{" "}
                            Active{" "}
                          </>
                        ) : (
                          "Inactive"
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        <div className="flex items-center gap-1.5 text-[var(--color-deep-purple)]/60">
                          <Layers size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">
                            {project?.steps.length} Steps
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
                      <Target size={128} />
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
        title={editingIndex !== null ? "Edit Milestone Project" : "New Milestone Project"}
        className="max-w-xl"
      >
        <div className="space-y-8 p-2">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Type size={12} /> Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Subathon Goals"
              value={tempProject.title}
              onChange={(e) => setTempProject({ ...tempProject, title: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-purple-300 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Current Amount - Readonly */}
          <div className="space-y-3">
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

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border-2 border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Project Steps
              </label>
              <button
                type="button"
                onClick={handleAddStepInModal}
                className="text-[10px] font-black text-[var(--color-deep-purple)] hover:text-black uppercase tracking-wider flex items-center gap-1"
              >
                <Plus size={12} /> Add Step
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {tempProject.steps?.map((step, sIdx) => (
                <div
                  key={sIdx}
                  className="flex gap-4 items-center bg-white border-2 border-slate-100 p-3 rounded-2xl animate-in slide-in-from-left-2 duration-200"
                >
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Step Label"
                      value={step.label}
                      onChange={(e) => handleUpdateStepInModal(sIdx, "label", e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold outline-none ring-0 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="w-[160px] relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">
                      Rp
                    </span>
                    <input
                      type="text"
                      placeholder="Amount"
                      value={step.value || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        handleUpdateStepInModal(sIdx, "value", Number(val));
                      }}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 pl-8 text-xs font-bold outline-none ring-0 focus:bg-white transition-all"
                    />
                  </div>
                  {tempProject.steps!.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStepInModal(sIdx)}
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
              {editingIndex !== null ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </div>
      </Modal>
    </OverlaySettingsTemplate>
  );
}
