'use server'

interface Formulaire {
  id: number
  name: string
  type: number
  descritpion: string
  // ajoute d'autres champs si besoin
}

export async function getFormsByTypeAndStatus(
  form_type: string,
  form_status: string,
  selected_organization: string | number,
  token: string
  
): Promise<Formulaire[]> {
  try {
   
    const url = `http://localhost:8000/forms?form_type=${form_type}&form_status=${form_status}&selected_organization=${selected_organization}`
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || "Échec de récupération des formulaires.")
    }

    return await res.json()
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des formulaires :", error)
    return []
  }
}
