"use server"

export async function getProgramsByOrganizationId(
  orgId: string | number,
  token: string
): Promise<any[]> {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant")
    }

    const url = `http://localhost:8000/programs?organization_id=${orgId}`
    console.log("🌐 Fetching from:", url)

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("❌ Erreur serveur :", error)
      throw new Error(error.detail || "Erreur lors de la récupération des programmes")
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("❌ Error fetching programs:", error)
    return []
  }
}
