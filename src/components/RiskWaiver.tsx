"use client"

import { RISK_WAIVER_TEXT } from "@/lib/constants"

interface RiskWaiverProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}

export default function RiskWaiver({ checked, onChange, error }: RiskWaiverProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-jtq-text">
        Carta de responsabilidad quirúrgica
      </label>
      <div className="max-h-40 overflow-y-auto rounded-lg border border-jtq-border bg-gray-50 p-4 text-sm text-jtq-text leading-relaxed">
        {RISK_WAIVER_TEXT}
      </div>
      <label
        htmlFor="risk-consent"
        className="flex items-start gap-3 cursor-pointer select-none"
      >
        <input
          type="checkbox"
          id="risk-consent"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 min-w-[20px] rounded border-jtq-border text-jtq-primary accent-jtq-primary cursor-pointer"
        />
        <span className="text-sm text-jtq-text leading-snug">
          He leído y acepto la carta de responsabilidad quirúrgica
        </span>
      </label>
      {error && (
        <p className="text-sm text-jtq-danger ml-8">{error}</p>
      )}
    </div>
  )
}
