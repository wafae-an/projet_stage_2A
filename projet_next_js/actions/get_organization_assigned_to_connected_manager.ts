'use server'

export interface Organization {
  id: number
  name: string
  address?: string
  city?: string
  country?: string
  email?: string
  facebook?: string
  linkedin?: string
  twitter?: string
  instagram?: string
  logo?: string
  cover?: string
  presentation?: string
  website?: string
  short_description?: string
  created?: string
  type?: string
}

export async function getAssignedOrganizations(token: string): Promise<Organization[]> {
  const response = await fetch("http://localhost:8000/my-organizations", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Erreur lors de la récupération des organisations")
  }

  return response.json()
}
