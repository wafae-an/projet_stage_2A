"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation d'envoi d'email
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
           <img src="/img/cnrst-removebg-preview.png" alt="Logo"/>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Mot de passe oublié</CardTitle>
            <CardDescription className="text-gray-600">
              {isSubmitted
                ? "Vérifiez votre boîte email"
                : "Entrez votre email pour recevoir un lien de réinitialisation"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isSubmitted ? (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  Un email de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de
                  réception et suivez les instructions.
                </AlertDescription>
              </Alert>

              <div className="text-center text-sm text-gray-600">
                Vous n'avez pas reçu l'email ?{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Renvoyer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
  type="submit"
  className="w-full bg-[#003366] hover:bg-[#004080] text-white rounded-md px-4 py-2 font-medium transition-colors duration-200"
  disabled={isLoading}
>
  {isLoading ? (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Envoi en cours...</span>
    </div>
  ) : (
    <div className="flex items-center justify-center space-x-2">
      <Send className="w-4 h-4" />
      <span>Envoyer le lien</span>
    </div>
  )}
</Button>

            </form>
          )}

          <div className="text-center">
  <Link
    href="/login"
    className="inline-flex items-center space-x-2 text-sm text-black hover:text-neutral-800 hover:underline transition-colors"
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
