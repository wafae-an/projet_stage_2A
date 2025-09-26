"use server"

export async function getOrganizationsByManager(managerId: number, token: string) {
  const res = await fetch(`http://localhost:8000/managers/${managerId}/organizations`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Erreur lors du chargement des organisations");
  return res.json(); // { assigned: [...], available: [...] }
}
