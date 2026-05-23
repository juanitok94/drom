"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Project } from "@/types/project";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ASHEVILLE_CENTER: [number, number] = [35.5905, -82.5800];

export default function RealMap({ projects, selectedId, onSelect }: Props) {
  const located = useMemo(
    () => projects.filter((p) => p.lat !== null && p.lng !== null),
    [projects]
  );

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={ASHEVILLE_CENTER}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          opacity={0.7}
        />

        {located.map((p) => {
          const isCurrent = p.status === "under-construction";
          const isSelected = selectedId === p.id;
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat!, p.lng!]}
              radius={isSelected ? 12 : 8}
              pathOptions={{
                color: isCurrent ? "#A8331F" : "#1C1A17",
                fillColor: isCurrent ? "#A8331F" : isSelected ? "#1C1A17" : "#F6F1E8",
                fillOpacity: isSelected ? 1 : 0.85,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onSelect(p.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={isSelected}>
                <span className="font-medium">{p.name}</span>
              </Tooltip>
            </CircleMarker>
          );
        })}

        <FitToBounds projects={located} />
      </MapContainer>

      {/* Unlocated notice */}
      {projects.length > located.length && (
        <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-none">
          <div className="inline-flex items-center gap-2 bg-cream/95 backdrop-blur-sm border border-ink/15 px-3 py-1.5 text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-stone" />
            <span className="text-charcoal">
              <span className="font-medium">{projects.length - located.length}</span>{" "}
              project{projects.length - located.length === 1 ? "" : "s"} not yet plotted —
              <span className="italic-accent"> needs confirmation</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function FitToBounds({ projects }: { projects: Project[] }) {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (fittedRef.current || projects.length === 0) return;
    const bounds = projects
      .filter((p) => p.lat !== null && p.lng !== null)
      .map((p) => [p.lat!, p.lng!] as [number, number]);
    if (bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    fittedRef.current = true;
  }, [map, projects]);

  return null;
}
