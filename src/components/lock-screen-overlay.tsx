'use client'

import { useState, useEffect } from 'react'

function formatDate(): string {
  const now = new Date()
  return now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatTime(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

export function LockScreenOverlay({ theme, deviceType }: { theme: 'dark' | 'light'; deviceType: 'desktop' | 'mobile' }) {
  const [date, setDate] = useState(formatDate())
  const [time, setTime] = useState(formatTime())

  useEffect(() => {
    const update = () => {
      setDate(formatDate())
      setTime(formatTime())
    }
    const now = new Date()
    const msToNextMin = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    const timeout = setTimeout(() => {
      update()
      const interval = setInterval(update, 60000)
      return () => clearInterval(interval)
    }, msToNextMin)
    return () => clearTimeout(timeout)
  }, [])

  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-800'

  if (deviceType === 'mobile') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-[22%] pointer-events-none select-none">
        <span className={`${textColor} text-[5px] font-semibold leading-tight opacity-90`}>
          {date}
        </span>
        <span
          className={`${textColor} text-[11px] font-bold leading-tight -mt-[1px]`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {time}
        </span>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-[10%] pointer-events-none select-none">
      <span className={`${textColor} text-[12px] font-semibold leading-tight opacity-90`}>
        {date}
      </span>
      <span
        className={`${textColor} text-[32px] font-bold leading-tight -mt-1`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {time}
      </span>
    </div>
  )
}
