"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Upload, Trash2, Play, AlertCircle, Music, Edit2 } from "lucide-react";
import { Soundboard } from "@/components/overlay/Soundboard";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Sound {
  id: string;
  name: string;
  file: File;
  url: string;
  duration: number;
  price: number;
  volume: number; // 0-100
}

export default function SoundboardOverlaySettingsPage() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null); // ID of playing sound
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Edit State
  const [editingSound, setEditingSound] = useState<Sound | null>(null);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      sounds.forEach(sound => URL.revokeObjectURL(sound.url));
    };
  }, [sounds]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    setIsUploading(true);

    // Filter valid files
    const validFiles: File[] = [];
    let currentError: string | null = null;
    const validTypes = ['audio/mpeg', 'audio/ogg', 'audio/wav'];

    // Check Limit
    if (sounds.length + files.length > 5) {
      setError(`You can only upload ${5 - sounds.length} more sound(s).`);
      setIsUploading(false);
      return;
    }

    files.forEach(file => {
      // Validate File Type
      if (!validTypes.includes(file.type)) {
        currentError = "Some files were ignored due to invalid format (.mp3, .ogg, .wav only).";
        return;
      }
      // Validate File Size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        currentError = "Some files were ignored because they exceed 2MB.";
        return;
      }
      validFiles.push(file);
    });

    if (currentError) setError(currentError);
    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    // Process valid files
    let processedCount = 0;
    const newSounds: Sound[] = [];

    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);

      audio.onloadedmetadata = () => {
        if (audio.duration > 10) {
          setError("Some files were skipped (duration > 10s).");
          URL.revokeObjectURL(url);
        } else {
          newSounds.push({
            id: crypto.randomUUID(),
            name: file.name.replace(/\.[^/.]+$/, ""),
            file,
            url,
            duration: audio.duration,
            price: 10000,
            volume: 80
          });
        }

        processedCount++;
        if (processedCount === validFiles.length) {
          setSounds(prev => {
            const updated = [...prev, ...newSounds];
            // Double check limit in case of race/duplicates
            return updated.slice(0, 5);
          });
          setIsUploading(false);
        }
      };

      audio.onerror = () => {
        processedCount++;
        if (processedCount === validFiles.length) setIsUploading(false);
      };
    });
  };

  const handleDelete = (id: string) => {
    setSounds(prev => {
      const sound = prev.find(s => s.id === id);
      if (sound) URL.revokeObjectURL(sound.url);
      return prev.filter(s => s.id !== id);
    });
    if (playingSound === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingSound(null);
    }
  };

  const handlePlay = (sound: Sound) => {
    if (playingSound === sound.id) {
      // Stop logic
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingSound(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(sound.url);
    audio.volume = sound.volume / 100; // Apply volume setting
    audioRef.current = audio;
    setPlayingSound(sound.id);

    audio.onended = () => {
      setPlayingSound(null);
      audioRef.current = null;
    };

    audio.play().catch(err => {
      console.error("Playback failed", err);
      setError("Failed to play audio.");
      setPlayingSound(null);
    });
  };

  const saveEdit = () => {
    if (!editingSound) return;
    setSounds(prev => prev.map(s => s.id === editingSound.id ? editingSound : s));
    setEditingSound(null);
  };

  return (
    <OverlaySettingsTemplate
      title="Soundboard"
      description="Upload short audio clips (max 10s, 2MB) for alerts."
      icon={<Volume2 size={24} />}
      type="soundboard"
      layout="stacked"
      previewContent={
        <div className="flex flex-col items-center gap-4">
          <Soundboard activeSound={{
            name: playingSound ? sounds.find(s => s.id === playingSound)?.name || "Unknown" : "Waiting...",
            isPlaying: !!playingSound
          }} />
          {!playingSound && <p className="text-xs text-slate-400">Play a sound to see visualizer</p>}
        </div>
      }
      settingsContent={
        <div className="space-y-6">
          {/* Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700">Upload Sound</label>
              <span className="text-xs font-bold text-slate-400">{sounds.length}/5 Sounds</span>
            </div>

            <div className={cn(
              "border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors relative",
              sounds.length >= 5 ? "opacity-50 cursor-not-allowed bg-slate-50" : "hover:bg-slate-50 cursor-pointer group"
            )}>
              <input
                type="file"
                multiple
                accept=".mp3,.ogg,.wav"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={isUploading || sounds.length >= 5}
              />
              <div className="p-3 bg-slate-100 rounded-full mb-3 text-slate-400 group-hover:bg-[var(--color-pastel-purple)] group-hover:text-[var(--color-deep-purple)] transition-colors">
                <Upload size={24} />
              </div>
              <p className="text-sm font-bold text-slate-600 mb-1">
                {sounds.length >= 5 ? "Limit Reached (Max 5)" : "Click to upload audio"}
              </p>
              <p className="text-xs text-slate-400">MP3, OGG, WAV (Max 2MB, 10s)</p>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>

          {/* Sound List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700">Your Sounds</label>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {sounds.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No sounds uploaded yet.
                </div>
              ) : (
                sounds.map((sound) => (
                  <div key={sound.id} className={cn(
                    "flex flex-col bg-white border rounded-xl shadow-sm transition-all overflow-hidden",
                    editingSound?.id === sound.id ? "border-[var(--color-deep-purple)] ring-1 ring-[var(--color-deep-purple)]" : "border-slate-100 hover:border-slate-300"
                  )}>
                    {/* Header Row */}
                    <div className="flex items-center justify-between p-3 gap-3">
                      <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-500 flex-shrink-0">
                          <Music size={18} />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col gap-1">
                          <p className="text-sm font-bold text-slate-800 truncate" title={sound.name}>{sound.name}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-medium">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{sound.duration.toFixed(1)}s</span>
                            <span className="text-[var(--color-deep-purple)] font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                              Rp {sound.price.toLocaleString('id-ID')}
                            </span>
                            <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                              <Volume2 size={10} className="opacity-50" /> {sound.volume}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handlePlay(sound)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            playingSound === sound.id
                              ? "bg-[var(--color-pastel-yellow)] text-yellow-700"
                              : "hover:bg-slate-100 text-slate-500"
                          )}
                          title="Preview"
                        >
                          {playingSound === sound.id ? <div className="w-3 h-3 bg-current rounded-sm animate-pulse" /> : <Play size={14} fill="currentColor" />}
                        </button>

                        <button
                          onClick={() => {
                            if (editingSound?.id === sound.id) {
                              setEditingSound(null);
                            } else {
                              setEditingSound({ ...sound });
                            }
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            editingSound?.id === sound.id
                              ? "bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)]"
                              : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                          )}
                          title="Edit Settings"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(sound.id)}
                          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Inline Edit Form */}
                    {editingSound?.id === sound.id && (
                      <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-2 duration-200">
                        <div className="bg-slate-50 rounded-lg p-3 space-y-3 border border-slate-100">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Name</label>
                            <input
                              type="text"
                              value={editingSound.name}
                              onChange={(e) => setEditingSound({ ...editingSound, name: e.target.value })}
                              className="w-full px-2 py-1.5 text-xs font-medium rounded-md border border-slate-200 focus:outline-none focus:border-[var(--color-deep-purple)] bg-white"
                              placeholder="Sound Name"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Min. Donation</label>
                              <div className="relative">
                                <span className="absolute left-2 top-1.5 text-xs text-slate-400">Rp</span>
                                <input
                                  type="number"
                                  value={editingSound.price}
                                  onChange={(e) => setEditingSound({ ...editingSound, price: parseInt(e.target.value) || 0 })}
                                  className="w-full pl-7 pr-2 py-1.5 text-xs font-medium rounded-md border border-slate-200 focus:outline-none focus:border-[var(--color-deep-purple)] bg-white"
                                  placeholder="10000"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex justify-between">
                                Volume <span>{editingSound.volume}%</span>
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={editingSound.volume}
                                onChange={(e) => setEditingSound({ ...editingSound, volume: parseInt(e.target.value) })}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-deep-purple)] mt-2"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingSound(null)}>Cancel</Button>
                            <Button size="sm" className="h-7 text-xs bg-[var(--color-deep-purple)] hover:bg-[var(--color-deep-purple)]/90" onClick={saveEdit}>Save</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
