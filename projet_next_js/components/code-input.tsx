"use client"

import type React from "react"

import { useRef } from "react"
import { Input } from "@/components/ui/input"

interface CodeInputProps {
  length?: number
  value: string[]
  onChange: (code: string[]) => void
  disabled?: boolean
  className?: string
}

export function CodeInput({ length = 6, value, onChange, disabled = false, className = "" }: CodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleInputChange = (index: number, inputValue: string) => {
    if (inputValue.length > 1) return

    const newCode = [...value]
    newCode[index] = inputValue
    onChange(newCode)

    // Auto-focus sur le champ suivant
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    const newCode = pastedData.split("").concat(Array(length - pastedData.length).fill(""))
    onChange(newCode)

    // Focus sur le dernier champ rempli ou le suivant
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={`flex justify-center space-x-3 ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-green-500"
          disabled={disabled}
        />
      ))}
    </div>
  )
}
