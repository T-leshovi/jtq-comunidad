"use client"

import Link from "next/link"

interface ConsentCheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  showPrivacyLink?: boolean
}

export default function ConsentCheckbox({
  id,
  label,
  checked,
  onChange,
  error,
  showPrivacyLink = false,
}: ConsentCheckboxProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="flex items-start gap-3 cursor-pointer select-none"
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 min-w-[20px] rounded border-jtq-border text-jtq-primary accent-jtq-primary cursor-pointer"
        />
        <span className="text-sm text-jtq-text leading-snug">
          {label}
          {showPrivacyLink && (
            <>
              {" "}
              <Link
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-jtq-primary underline font-medium"
              >
                Aviso de Privacidad
              </Link>
            </>
          )}
        </span>
      </label>
      {error && (
        <p className="text-sm text-jtq-danger ml-8">{error}</p>
      )}
    </div>
  )
}
