"use server";

type ActionResponse = {
  success: boolean;
  message: string;
  email?: string;
  redirect?: string;
   // utile pour l’étape suivante
};

export async function signIn(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      success: false,
      message: "Email et mot de passe requis",
    };
  }

  try {
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.detail || "Erreur de connexion",
      };
    }

    return {
      success: true,
      message: "email envoyé",
      email: email as string,
      redirect: `/verify-email?email=${encodeURIComponent(email as string)}`,
    };

  } catch (error) {
    return {
      success: false,
      message: "Erreur de serveur",
    };
  }
}
