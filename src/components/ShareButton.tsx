"use client"

import { useState } from "react"

interface ShareButtonProps {
  folio: string
  activityName: string
}

export default function ShareButton({ folio, activityName }: ShareButtonProps) {
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    const text = `¡Me registré en ${activityName}! Mi folio es ${folio}. 🐾`

    if (navigator.share) {
      try {
        await navigator.share({
          title: activityName,
          text,
        })
        setShared(true)
        setTimeout(() => setShared(false), 3000)
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text)
        setShared(true)
        setTimeout(() => setShared(false), 3000)
      } catch {
        // Clipboard not available
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-full glass-card rounded-xl p-4 text-sm font-semibold text-jtq-primary flex items-center justify-center gap-2 active:scale-95 transition-transform"
    >
      {shared ? (
        <>
          <span>✅</span> ¡Compartido!
        </>
      ) : (
        <>
          <span>📤</span> Compartir mi registro
        </>
      )}
    </button>
  )
}
