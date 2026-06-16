"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { StoryPin } from "@/content/stories";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Props {
  center: [number, number];
  zoom: number;
  pins: StoryPin[];
}

export default function StoryMap({ center, zoom, pins }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom,
      attributionControl: false,
      cooperativeGestures: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    pins.forEach((pin) => {
      const el = document.createElement("div");
      const kind = pin.kind ?? "project";
      el.className = `pi-pin ${kind === "anchor" ? "is-anchor" : kind === "office" ? "is-active" : ""}`;
      el.setAttribute("data-label", pin.label);
      el.innerHTML = `<span class="pi-pin-dot"></span><span class="pi-pin-pulse"></span>`;

      const popupHtml = `
        <div style="font-family: var(--font-display, serif); padding: 4px 2px;">
          <div style="font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-gold, #C9A96E); margin-bottom: 4px;">
            ${kind === "anchor" ? "Anchor" : kind === "office" ? "Office" : "Project"}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: ${pin.caption ? "4px" : "0"};">
            ${pin.label}
          </div>
          ${pin.caption ? `<div style="font-size: 11px; color: rgba(255,255,255,0.65); line-height: 1.4;">${pin.caption}</div>` : ""}
          ${pin.projectSlug ? `<a href="/projects/${pin.projectSlug}" style="display: inline-block; margin-top: 8px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-gold, #C9A96E); text-decoration: none;">View project →</a>` : ""}
        </div>
      `;

      new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(pin.coords)
        .setPopup(new mapboxgl.Popup({ offset: 14, closeButton: false, className: "pi-popup" }).setHTML(popupHtml))
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom, pins]);

  if (!TOKEN) {
    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ background: "var(--color-surface)" }}
      >
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-text-subtle)" }}>
          Map unavailable — Mapbox token missing
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
