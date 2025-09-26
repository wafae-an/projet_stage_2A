"use server"

type VerifyResponse = {
  success: boolean
  message: string
  redirect?: string
  token?: string
  roles?: string[]
}

export async function verifyEmailCode(
  prevState: any,
  formData: FormData
): Promise<VerifyResponse> {
  const email = formData.get("email") as string
  const code = formData.get("code") as string

  if (!email || !code) {
    return {
      success: false,
      message: "Email ou code manquant",
    }
  }

  try {
    const res = await fetch("http://localhost:8000/verify_code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        message: data.detail || "Code incorrect",
      }
    }

    const { token, roles } = data

    // Redirection selon le rôle
    let redirect = "/admin"
    if (roles?.includes("ROLE_ADMIN")) {
      redirect = "/admin"
    } else if (roles?.includes("ROLE_ORGANIZATION")) {
      redirect = "/manager_dashbord"
    }

    return {
      success: true,
      message: "Code vérifié avec succès",
      token,
      roles,
      redirect,
    }

  } catch (error) {
    console.error("Erreur côté client :", error)
    return {
      success: false,
      message: "Erreur réseau ou serveur",
    }
  }
}
