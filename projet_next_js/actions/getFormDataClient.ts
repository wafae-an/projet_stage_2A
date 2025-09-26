"use server"

export async function getFormDataClient(formId: number, fieldIds: number[],candidatureType: string, formType: string, token: string) {
  

  const res = await fetch("http://localhost:8000/formulaires/data", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",

    },
    body: JSON.stringify({
      form_id: formId,
      field_ids: fieldIds,
      candidature_type: candidatureType,
      form_type: formType,

    }),
  })

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données")
  }

  return await res.json()
}

