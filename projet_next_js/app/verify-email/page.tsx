"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useActionState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Smartphone, RotateCcw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyEmailCode } from "../../actions/verifyEmailCode"
import { resendEmailCode } from "../../actions/resend_otp"



export default function VerifySMSPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""
  

  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [state, action, isPending] = useActionState(verifyEmailCode, null)

  // Timer pour le renvoi du code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  // Redirection en cas de succès

 useEffect(() => {
  if (state?.success) {
    // Stocker le token si présent
    if (state.token) {
      localStorage.setItem("token", state.token)
    }

    // Redirection si nécessaire
    if (state.redirect) {
      router.push(state.redirect)
    }
  }
}, [state, router])


  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Auto-focus sur le champ suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = pastedData.split("").concat(Array(6 - pastedData.length).fill(""))
    setCode(newCode)

    // Focus sur le dernier champ rempli ou le suivant
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

const handleResendCode = async () => {
  setIsResending(true)
  try {
    const success = await resendEmailCode(email)
    if (success) {
      setTimeLeft(60)
      setCanResend(false)
      setCode(["", "", "", "", "", ""]) // Réinitialiser le champ code
    } else {
      alert("Échec de l'envoi du code. Veuillez réessayer.")
    }
  } catch (error) {
    console.error("Erreur lors du renvoi:", error)
  } finally {
    setIsResending(false)
  }
}


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Vérification par e-mail</CardTitle>
            <CardDescription className="text-gray-600">
              Entrez le code à 6 chiffres envoyé à l'adresse e-mail : <b>{email}</b>
              <br />
              
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form action={action} className="space-y-6">
            {/* Champ email caché */}
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="code" value={code.join("")} />

            {/* Champs de saisie du code */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-green-500"
                    disabled={isPending}
                  />
                ))}
              </div>

              {/* Indicateur de progression */}
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {code.map((digit, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${digit ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Message d'erreur ou de succès */}
            {state && (
              <Alert className={state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Bouton de vérification */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={isPending || code.join("").length !== 6}
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Vérification...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Vérifier le code</span>
                </div>
              )}
            </Button>
          </form>

          {/* Section de renvoi du code */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Smartphone className="w-4 h-4" />
              <span>Code non reçu ?</span>
            </div>

            {canResend ? (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Renvoyer l' e-mail</span>
                  </div>
                )}
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Renvoyer le code dans <span className="font-medium text-gray-700">{formatTime(timeLeft)}</span>
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Conseils de sécurité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Conseils de sécurité :</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Le code expire dans 5 minutes</li>
                  <li>• Vérifiez votre boîte de réception et vos spams</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lien de retour */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la connexion</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
