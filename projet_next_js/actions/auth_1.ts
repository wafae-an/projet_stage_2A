"use server"

export async function signIn(formData: FormData) {
  // Simulation d'un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validation basique
  if (!email || !password) {
    return {
      success: false,
      message: "Email et mot de passe requis",
    }
  }

  // Simulation de vérification des identifiants
  if (email === "admin@example.com" && password === "password123") {
    return {
      success: true,
      message: "Connexion réussie",
    }
  }

  return {
    success: false,
    message: "Email ou mot de passe incorrect",
  }
}

export async function verifySMSCode(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const code = formData.get("code") as string
  const email = formData.get("email") as string

  if (!code || code.length !== 6) {
    return {
      success: false,
      message: "Code à 6 chiffres requis",
    }
  }

  // Simulation de vérification du code
  if (code === "123456") {
    return {
      success: true,
      message: "Connexion réussie",
      redirect: "/dashboard",
    }
  }

  return {
    success: false,
    message: "Code incorrect. Veuillez réessayer.",
  }
}

export async function resendSMSCode(email: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    success: true,
    message: "Nouveau code envoyé par SMS",
  }
}
