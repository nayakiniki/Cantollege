"use client"

import Aurora from "./aurora"

export function CantollegeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Aurora
        colorStops={[
          "#ff6b35", // Orange
          "#f7931e", // Yellow-orange
          "#8b5cf6", // Violet
        ]}
        amplitude={0.8}
        blend={0.3}
        speed={0.5}
      />
      {/* Overlay to ensure content readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px]" />
    </div>
  )
}
