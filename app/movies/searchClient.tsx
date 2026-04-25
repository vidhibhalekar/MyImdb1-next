"use client";

import { useSearchParams } from "next/navigation";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return (
    <div>
      <p className="text-gray-400">
        Search: {search || "All Movies"}
      </p>
    </div>
  );
}