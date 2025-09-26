"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "../../actions/auth"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, action, isPending] = useActionState(signIn, null)
  
  const router = useRouter()



useEffect(() => {

  if (state?.success && state?.redirect) {
  router.push(state.redirect)
}
}, [state])


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src="/img/cnrst-removebg-preview.png" alt="Logo" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Connexion</CardTitle>
            <CardDescription className="text-gray-600">Connectez-vous à votre compte pour continuer</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-10"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  className="pl-10 pr-10"
                  required
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Masquer" : "Afficher"} le mot de passe
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot_pass"
                className="text-sm text-black hover:text-neutral-800 hover:underline transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {state && (
              <Alert className={state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-[#003366] hover:bg-[#004080] text-white rounded-md px-4 py-2 font-medium transition-colors duration-200"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Se connecter</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}