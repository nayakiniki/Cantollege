"use client"

export function CssAuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-container">
        <div className="aurora-layer aurora-layer-1"></div>
        <div className="aurora-layer aurora-layer-2"></div>
        <div className="aurora-layer aurora-layer-3"></div>
      </div>
      {/* Overlay to ensure content readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
    </div>
  )
}
