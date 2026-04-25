export async function getActor(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/actors/${id}`, {
    next: { revalidate: 60, tags: ["actor"] },
    cache: "force-cache",
  });

  return res.json();
}