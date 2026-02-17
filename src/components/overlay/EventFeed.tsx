import { motion } from "framer-motion";

interface EventFeedItem {
  id: string;
  user: string;
  action: string;
  time: string; // e.g. "2m ago"
}

interface EventFeedProps {
  events: EventFeedItem[];
}

export function EventFeed({ events }: EventFeedProps) {
  return (
    <div className="flex flex-col gap-2 w-64 overflow-hidden mask-gradient-vertical items-end">
      {events.slice(0, 5).map((e, index) => (
        <motion.div
          key={e.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex justify-between items-center w-full bg-slate-900/60 backdrop-blur-sm p-2 rounded-lg border-r-2 border-[var(--color-accent-purple)]"
        >
          <div className="text-xs text-white">
            <span className="font-bold text-[var(--color-accent-purple)]">{e.user}</span> {e.action}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
