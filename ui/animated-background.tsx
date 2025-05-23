"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="animated-gradient"></div>
      <div className="overlay"></div>
    </div>
  )
}
