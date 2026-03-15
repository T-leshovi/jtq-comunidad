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
      <label className="block text-sm font-semibold text-slate-800">
        Carta de responsabilidad quirúrgica
      </label>
      <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-300 bg-gray-50 p-4 text-sm text-slate-700 leading-relaxed">
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
          className="mt-0.5 h-5 w-5 min-w-[20px] rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
        />
        <span className="text-sm text-slate-700 leading-snug">
          He leído y acepto la carta de responsabilidad quirúrgica
        </span>
      </label>
      {error && (
        <p className="text-sm text-red-600 ml-8">{error}</p>
      )}
    </div>
  )
}
