export interface ApplicationStats {
  total: number;
  submitted: number;
  not_submitted: number;
  with_documents: number;
}

/**
 * Récupère les statistiques pour un formulaire donné
 * @param formId ID du formulaire
 * @returns Promise contenant les stats
 */
export async function getFormStats(formId: number, token: string): Promise<ApplicationStats> {
  const response = await fetch(`http://localhost:8000/stats/form/${formId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} lors de la récupération des statistiques`);
  }

  const data: ApplicationStats = await response.json();
  return data;
}
