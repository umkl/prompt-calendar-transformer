import { cn } from "@/lib/utils"

interface IOSLoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function IOSLoader({ size = "md", className }: IOSLoaderProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("ios-loader", sizeClasses[size], className)}>
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
