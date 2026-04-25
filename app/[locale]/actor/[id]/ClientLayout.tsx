"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ClientLayout({
  children,
  awards,
  social,
  similar,
  messages,
}: any) {
  const [active, setActive] = useState("awards");

  const tabs = [
    { key: "awards", label: messages?.awards || "Awards" },
    { key: "social", label: messages?.social || "Social" },
    { key: "similar", label: messages?.similar || "Similar" },
  ];

  return (
    <div className="space-y-10">
      {children}

      {/* TABS */}
      <div className="flex gap-6 border-b border-zinc-800 pb-4 text-sm md:text-base">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`relative pb-2 transition ${
              active === tab.key
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}

            {active === tab.key && (
              <motion.span
                layoutId="underline"
                className={`absolute left-0 bottom-0 h-[2px] w-full ${
                  tab.key === "awards"
                    ? "bg-yellow-500"
                    : tab.key === "social"
                    ? "bg-blue-500"
                    : "bg-pink-500"
                }`}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* CONTENT */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-6"
      >
        {active === "awards" && awards}
        {active === "social" && social}
        {active === "similar" && similar}
      </motion.div>
    </div>
  );
}