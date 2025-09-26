"use server";

export async function addManager(
  formData: {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
  },
  token: string
) {
  try {
    const res = await fetch("http://localhost:8000/add_manager", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ token passé en paramètre
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || "Erreur lors de l'ajout.",
      };
    }

    return { success: true, message: "Gestionnaire ajouté avec succès." };
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return {
      success: false,
      message: "Erreur de connexion avec le serveur.",
    };
  }
}
