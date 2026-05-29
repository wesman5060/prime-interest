"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/** Prime Interest office — 4235 South Lee St, Buford, GA 30518 (geocoded). */
const OFFICE: [number, number] = [-84.00014, 34.09633];

export default function OfficeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: OFFICE,
      zoom: 14.5,
      attributionControl: false,
      cooperativeGestures: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    const el = document.createElement("div");
    el.className = "pi-pin is-active";
    el.setAttribute("data-label", "Prime Interest");
    el.innerHTML = `<span class="pi-pin-dot"></span><span class="pi-pin-pulse"></span>`;

    new mapboxgl.Marker({ element: el, anchor: "center" })
      .setLngLat(OFFICE)
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
