import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#000000",
        border: "1px solid #C9A96E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
        fontWeight: 700,
        color: "#C9A96E",
        fontSize: 12,
        letterSpacing: 2,
      }}
    >
      PI
    </div>,
    { ...size }
  );
}
