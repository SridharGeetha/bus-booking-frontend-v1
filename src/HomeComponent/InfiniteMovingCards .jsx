"use client";

import { cn } from "/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-10 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4 ",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <div>
            <li
              className="relative w-[350px] max-w-full shrink-0 rounded-2xl border-2 border-[#00b4db]/40 px-8 py-6 md:w-[450px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 180, 219, 0.15), rgba(0, 131, 176, 0.15))",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0, 180, 219, 0.3)",
              }}
              key={item.busId}
            >
              <blockquote>
                <div
                  aria-hidden="true"
                  className="user-select-none  pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>

                <div className="relative z-20 text-center mb-4">
                  <span className="text-xs uppercase tracking-wider text-[#8a9bb8] font-semibold block mb-1">
                    Bus ID
                  </span>
                  <span className="text-3xl font-bold text-white drop-shadow-lg">
                    {item.busId}
                  </span>
                </div>

                <div className="relative z-20 text-center mb-6 pb-4 border-b-2 border-[#00b4db]/30">
                  <span className="text-xs uppercase tracking-wider text-[#8a9bb8] font-semibold block mb-1">
                    Route
                  </span>
                  <span className="text-lg font-semibold text-[#00b4db]">
                    {item.route}
                  </span>
                </div>

                <div className="relative z-20 flex justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">📍</span>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-[#8a9bb8] font-semibold">
                        From
                      </span>
                      <span className="text-sm font-semibold text-white leading-tight">
                        {item.startingPoint}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">🎯</span>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-[#8a9bb8] font-semibold">
                        To
                      </span>
                      <span className="text-sm font-semibold text-white leading-tight">
                        {item.endingPoint}
                      </span>
                    </div>
                  </div>
                </div>
              </blockquote>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};
