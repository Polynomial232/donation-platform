import React from "react";
import { cn } from "@/lib/utils"; // Assumes a 'cn' utility for classnames
import Link from "next/link";

// Define the props for the component
interface HeroCollageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle: string;
  stats: { value: string; label: string }[];
  images: { src: string; username?: string }[];
}

// Keyframes for the floating animation
const animationStyle = `
  @keyframes float-up {
    0% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    50% { transform: translateY(-15px); box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3); }
    100% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
  }
  .animate-float-up {
    animation: float-up 6s ease-in-out infinite;
  }
`;

const COLLAGE_SLOTS = [
  {
    // Slot 0: Center
    container: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
    image: "w-[240px] sm:w-[340px] aspect-[4/5] object-cover rounded-3xl border-4",
    delay: "0s",
  },
  {
    // Slot 1: Top-Left
    container: "left-[10%] top-[2%] z-10 hidden sm:block",
    image: "w-44 aspect-[4/5] object-cover rounded-2xl border-2",
    delay: "-1.2s",
  },
  {
    // Slot 2: Top-Right
    container: "right-[12%] top-[0%] z-10 hidden sm:block",
    image: "w-40 aspect-[4/5] object-cover rounded-2xl border-2",
    delay: "-2.5s",
  },
  {
    // Slot 3: Bottom-Right
    container: "right-[8%] bottom-[5%] z-30 hidden sm:block",
    image: "w-48 aspect-[4/5] object-cover rounded-2xl border-2",
    delay: "-3.5s",
  },
  {
    // Slot 4: Bottom-Left
    container: "left-[6%] bottom-[4%] z-30 hidden sm:block",
    image: "w-44 aspect-[4/5] object-cover rounded-2xl border-2",
    delay: "-5.2s",
  },
  {
    // Slot 5: Far-Right
    container: "right-[1%] top-[35%] z-10 hidden lg:block",
    image: "w-40 aspect-[4/5] object-cover rounded-xl border-2",
    delay: "-4.8s",
  },
  {
    // Slot 6: Far-Left
    container: "left-[0%] top-[15%] z-10 hidden lg:block",
    image: "w-36 aspect-[4/5] object-cover rounded-xl border-2",
    delay: "-6s",
  },
  {
    // Slot 7: Top-Mid Left
    container: "left-[32%] top-[0%] z-10 hidden md:block",
    image: "w-32 aspect-[4/5] object-cover rounded-xl border-2",
    delay: "-2.1s",
  },
  {
    // Slot 8: Top-Mid Right
    container: "right-[30%] top-[5%] z-10 hidden md:block",
    image: "w-28 aspect-[4/5] object-cover rounded-xl border-2",
    delay: "-3.2s",
  },
  {
    // Slot 9: Bottom-Mid Left
    container: "left-[28%] bottom-[8%] z-10 hidden md:block",
    image: "w-32 aspect-[4/5] object-cover rounded-xl border-2",
    delay: "-5.7s",
  },
];

const HeroCollage = React.forwardRef<HTMLDivElement, HeroCollageProps>(
  ({ className, title, subtitle, stats, images, ...props }, ref) => {
    // Support up to 10 images
    const displayImages = images.slice(0, 10);

    return (
      <>
        <style>{animationStyle}</style>
        <section
          ref={ref}
          className={cn(
            "relative w-full bg-transparent font-sans py-20 sm:py-32 overflow-hidden",
            className
          )}
          {...props}
        >
          {/* Main Content */}
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground font-medium">
              {subtitle}
            </p>
          </div>

          {/* Image Collage - 10 Large slots */}
          <div className="relative z-0 mt-20 h-[550px] flex items-center justify-center">
            <div className="relative h-full w-full max-w-7xl">
              {displayImages.map((image, index) => {
                const slot = COLLAGE_SLOTS[index];
                if (!slot) return null;

                const content = (
                  <img
                    src={image.src}
                    alt={`Hero ${index + 1}`}
                    className={cn(
                      "h-auto shadow-2xl border-white transition-transform duration-500 hover:scale-110",
                      slot.image
                    )}
                  />
                );

                return (
                  <div
                    key={index}
                    className={cn("absolute animate-float-up", slot.container)}
                    style={{ animationDelay: slot.delay }}
                  >
                    {image.username ? (
                      <Link href={`/${image.username}`} className="block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="container relative z-10 mx-auto mt-8 px-4">
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <p className="text-4xl font-black tracking-tighter text-[var(--color-deep-purple)] transition-transform group-hover:scale-110">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
);

HeroCollage.displayName = "HeroCollage";

export { HeroCollage };
