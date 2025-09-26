"use server"

export async function saveOrganizationsForManager(managerId: number, organizationIds: number[],token: string ) {
  const res = await fetch("http://localhost:8000/organization/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      manager_id: managerId,
      organization_ids: organizationIds,
    }),
  })

  if (!res.ok) {
    throw new Error("Erreur lors de la sauvegarde des affectations")
  }

  return res.json()
}
