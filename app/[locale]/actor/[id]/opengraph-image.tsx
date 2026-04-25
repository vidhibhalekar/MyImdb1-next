import { ImageResponse } from "next/og";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `http://localhost:3000/api/actors/${id}`
  );

  const actor = await res.json();

  return new ImageResponse(
    (
      <div
        style={{
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <img
          src={actor.image}
          width="150"
          height="150"
          style={{ borderRadius: "50%" }}
        />

        <h1 style={{ fontSize: 50, marginTop: 20 }}>
          {actor.name}
        </h1>

        <p style={{ fontSize: 25, color: "gray" }}>
          Actor Profile
        </p>
      </div>
    )
  );
}