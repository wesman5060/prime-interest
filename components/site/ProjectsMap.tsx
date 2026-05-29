"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Project } from "@/lib/content/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const GEORGIA_CENTER: [number, number] = [-83.95, 33.95];

interface Props {
  projects: Project[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}

export default function ProjectsMap({ projects, selectedSlug, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; el: HTMLElement }>>(new Map());
  const loadedRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [hintVisible, setHintVisible] = useState(true);

  // Initialize map once.
  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: GEORGIA_CENTER,
      zoom: 7.1,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    map.on("load", () => { loadedRef.current = true; });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
    };
  }, []);

  // Sync markers when filtered list changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const visible = new Set(projects.map((p) => p.slug));

    markersRef.current.forEach((entry, slug) => {
      if (!visible.has(slug)) {
        entry.marker.remove();
        markersRef.current.delete(slug);
      }
    });

    projects.forEach((project, index) => {
      if (markersRef.current.has(project.slug)) return;

      const el = document.createElement("button");
      el.type = "button";
      el.className = "pi-pin";
      el.setAttribute("aria-label", project.name);
      el.setAttribute("data-label", project.name);
      el.innerHTML = `<span class="pi-pin-dot"></span><span class="pi-pin-pulse"></span>`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current(project.slug);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(project.coordinates)
        .addTo(map);

      // Staggered drop-in.
      el.style.opacity = "0";
      el.style.transform = "translateY(-12px) scale(0.4)";
      window.setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
      }, 80 + (index % 24) * 35);

      markersRef.current.set(project.slug, { marker, el });
    });
  }, [projects]);

  // Highlight selected pin and fly to it.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(({ el }, slug) => {
      el.classList.toggle("is-active", slug === selectedSlug);
    });

    if (!selectedSlug) return;
    const target = projects.find((p) => p.slug === selectedSlug);
    if (!target) return;

    const fly = () =>
      map.flyTo({
        center: target.coordinates,
        zoom: Math.max(map.getZoom(), 10),
        speed: 0.9,
        curve: 1.4,
        essential: true,
      });

    if (loadedRef.current) fly();
    else map.once("load", fly);
  }, [selectedSlug, projects]);

  if (!TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center" style={{ background: "var(--color-surface)" }}>
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-text-subtle)" }}>
          Map unavailable — Mapbox token missing
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* Scroll hint — fades out after first interaction */}
      {hintVisible && (
        <div
          className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 z-10 px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-opacity duration-700"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
          onAnimationEnd={() => setHintVisible(false)}
        >
          Scroll to zoom · Click a pin to explore
        </div>
      )}
    </div>
  );
}
