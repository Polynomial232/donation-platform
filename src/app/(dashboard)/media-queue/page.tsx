"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, SkipForward, Pause, RefreshCw, Trash2, Volume2, MoveUp } from "lucide-react";

export default function MediaQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Media Queue</h2>
        <p className="text-slate-500 font-medium">Manage incoming video and sound requests.</p>
      </div>

      {/* Live Control Deck */}
      <Card className="p-6 border-none shadow-sm bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-[var(--color-deep-purple)] blur-[100px] opacity-30 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-64 aspect-video bg-black rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
            <img
              src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Play className="fill-white text-white ml-1" />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  LIVE
                </span>
                <span className="text-slate-400 text-xs font-bold">Mediashare</span>
              </div>
              <h3 className="text-xl font-bold">Rick Astley - Never Gonna Give You Up</h3>
              <p className="text-slate-400 text-sm">
                Requested by <span className="text-white font-bold">Budi01</span> • IDR 10.000
              </p>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--color-accent-yellow)] h-full w-[45%]"></div>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>00:45</span>
              <span>03:32</span>
            </div>

            <div className="flex gap-2">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-none">
                <Pause size={18} />
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-none">
                <SkipForward size={18} />
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-none">
                <RefreshCw size={18} />
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Volume2 size={18} className="text-slate-400" />
                <div className="w-24 h-1 bg-white/20 rounded-full">
                  <div className="w-[80%] h-full bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Queue List */}
      <h3 className="text-lg font-bold text-slate-900 mt-8">Up Next</h3>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="p-4 flex items-center gap-4 border-none shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="font-mono text-slate-400 font-bold text-lg w-6 text-center">{i}</div>
            <div className="w-16 h-10 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 relative">
              {i % 2 === 0 ? (
                <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                  <Volume2 size={16} className="text-indigo-500" />
                </div>
              ) : (
                <img
                  src={`https://img.youtube.com/vi/dQw4w9WgXcQ/${i}.jpg`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">
                {i % 2 === 0 ? "Jumpscare Sound Effect" : "Epic Cat Fails 2024"}
              </h4>
              <p className="text-xs text-slate-500">
                {i % 2 === 0 ? "Soundboard" : "Mediashare"} •{" "}
                <span className="font-bold text-slate-700">Siti_G</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[var(--color-deep-purple)]"
              >
                <MoveUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
