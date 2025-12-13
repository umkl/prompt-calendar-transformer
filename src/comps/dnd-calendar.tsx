"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface DnDCalendarProps {
  events: pct.Event[]
  onEventMove: (eventId: string, newStart: Date) => void
  onFirstLoaded: (firstElement: HTMLDivElement) => void
}

export function DnDCalendar({ events, onEventMove, onFirstLoaded }: DnDCalendarProps) {
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null)
  const [dropIndicatorTime, setDropIndicatorTime] = useState<Date | null>(null)
  const [touchOffset, setTouchOffset] = useState<number>(0)
  const calendarRef = useRef<HTMLDivElement>(null)

  const startHour = 6
  const endHour = 22
  const totalHours = endHour - startHour

  useEffect(()=>{
    console.log("Events changed:", events.length);
    if(events.length > 0 && calendarRef.current){
      const firstElement = calendarRef.current.querySelector<HTMLDivElement>(`[data-event-id="${events[0].id}"]`);
      if(firstElement){
        console.log("First element found:", firstElement);
        onFirstLoaded(firstElement);
      }
    }
  }, [events, onFirstLoaded]);

  // Generate time markers for every 15 minutes
  const timeMarkers: Date[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const date = new Date(2025, 0, 12, hour, minute)
      timeMarkers.push(date)
    }
  }

  const getPositionFromTime = (date: Date): number => {
    const hours = date.getHours() + date.getMinutes() / 60
    return ((hours - startHour) / totalHours) * 100
  }

  const getTimeFromPosition = (clientY: number): Date => {
    if (!calendarRef.current) return new Date()

    const rect = calendarRef.current.getBoundingClientRect()
    const relativeY = clientY - rect.top
    const percentage = Math.max(0, Math.min(1, relativeY / rect.height))

    const totalMinutes = totalHours * 60
    const minutesFromStart = Math.round((percentage * totalMinutes) / 15) * 15
    const hour = startHour + Math.floor(minutesFromStart / 60)
    const minute = minutesFromStart % 60

    return new Date(2025, 0, 12, hour, minute)
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDuration = (start: Date, end: Date): string => {
    const minutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  // Mouse drag handlers
  const handleMouseDown = (eventId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setDraggedEventId(eventId)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedEventId) {
      const time = getTimeFromPosition(e.clientY)
      setDropIndicatorTime(time)
    }
  }

  const handleMouseUp = () => {
    if (draggedEventId && dropIndicatorTime) {
      onEventMove(draggedEventId, dropIndicatorTime)
    }
    setDraggedEventId(null)
    setDropIndicatorTime(null)
  }

  // Touch drag handlers for mobile
  const handleTouchStart = (eventId: string, e: React.TouchEvent) => {
    const touch = e.touches[0]
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const offset = touch.clientY - rect.top

    setTouchOffset(offset)
    setDraggedEventId(eventId)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedEventId) {
      e.preventDefault()
      const touch = e.touches[0]
      const adjustedY = touch.clientY - touchOffset
      const time = getTimeFromPosition(adjustedY)
      setDropIndicatorTime(time)
    }
  }

  const handleTouchEnd = () => {
    if (draggedEventId && dropIndicatorTime) {
      onEventMove(draggedEventId, dropIndicatorTime)
    }
    setDraggedEventId(null)
    setDropIndicatorTime(null)
    setTouchOffset(0)
  }

  // Prevent scrolling while dragging on mobile
  useEffect(() => {
    if (draggedEventId) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
  }, [draggedEventId])

  return (
    <div
      ref={calendarRef}
      className="relative select-none rounded-lg border border-border bg-card shadow-sm"
      style={{ height: `${totalHours * 80}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Time markers */}
      {timeMarkers.map((time, index) => {
        const isHourMark = time.getMinutes() === 0
        return (
          <div key={index} className="absolute left-0 right-0" style={{ top: `${getPositionFromTime(time)}%` }}>
            <div className={`border-t ${isHourMark ? "border-border" : "border-border/40"}`} />
            {isHourMark && (
              <span className="absolute -top-2 left-2 text-xs text-muted-foreground">{formatTime(time)}</span>
            )}
          </div>
        )
      })}

      {/* Drop indicator */}
      {dropIndicatorTime && draggedEventId && (
        <div
          className="pointer-events-none absolute left-0 right-0 z-30"
          style={{ top: `${getPositionFromTime(dropIndicatorTime)}%` }}
        >
          <div className="border-t-2 border-red-500" />
          <div className="absolute -top-2 right-2 rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
            {formatTime(dropIndicatorTime)}
          </div>
        </div>
      )}

      {/* Events */}
      {events.map((event) => {
        const top = getPositionFromTime(event.start)
        const bottom = getPositionFromTime(event.end)
        const height = bottom - top
        const isDragging = draggedEventId === event.id

        return (
          <div
            key={event.id}
            className={`absolute left-0 right-0 cursor-grab px-2 transition-opacity active:cursor-grabbing ${
              isDragging ? "z-20 opacity-50" : "z-10"
            }`}
            style={{
              top: `${top}%`,
              height: `${height}%`,
            }}
            data-event-id={event.id}
            onMouseDown={(e) => handleMouseDown(event.id, e)}
            onTouchStart={(e) => handleTouchStart(event.id, e)}
          >
            <div className="h-full rounded-md bg-primary px-3 py-2 text-primary-foreground shadow-sm">
              <div className="flex h-full flex-col justify-between">
                <div className="font-medium leading-tight text-sm">{event.title}</div>
                <div className="text-xs opacity-90">
                  {formatTime(event.start)} • {formatDuration(event.start, event.end)}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
