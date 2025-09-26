"use client"

export async function getManagersClient() {
  try {
    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:8000/gestionnaires", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error("Erreur lors du chargement des gestionnaires")
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Erreur réseau :", error)
    return []
  }
}
