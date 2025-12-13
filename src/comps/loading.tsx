import { cn } from "@/lib/utils"

interface IOSLoaderProps {
  className?: string
}

export function IOSLoader({ className }: IOSLoaderProps) {
  return (
    <div className={cn("ios-loader w-4 h-4", className)}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="ios-loader-bar"
          style={{
            transform: `rotate(${i * 30}deg) translate(0, -135%)`,
            animationDelay: `${-1.2 + i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}
