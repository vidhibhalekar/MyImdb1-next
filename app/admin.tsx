"use client";

export default function RevalidateButton() {
  const handleRevalidate = async () => {
    await fetch("/api/revalidate", {
      method: "POST",
      body: JSON.stringify({ tag: "actor" }),
    });

    alert("Revalidated!");
  };

  return (
    <button
      onClick={handleRevalidate}
      className="bg-yellow-500 px-4 py-2 rounded"
    >
      Revalidate Actor
    </button>
  );
}