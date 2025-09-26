"use server"

export interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  organism: string
  country: string
  roles: string // JSON string
  created: string
  confirmed: number
  confirmed_on: string
  token: string
  is_jury?: number  
}

export async function getUsers(
  roleLabel: string,
  confirmedUser: number,
  token: string
): Promise<User[]> {
  try {
    const params = new URLSearchParams({
      role_label: roleLabel,
      confirmed_user: confirmedUser.toString(), // ✅ conversion en string requise
    })

    const res = await fetch(`http://localhost:8000/users?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      // credentials: "include", // ajoute ça si tu utilises des cookies/session
    })

    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des utilisateurs")
    }

    const data: User[] = await res.json()
    return data
  } catch (error) {
    console.error("❌ Erreur dans getUsers:", error)
    return []
  }
}
