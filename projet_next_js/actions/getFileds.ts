"use server"

export async function getFieldsByForm(formId: number,token: string ) {
  try {
    const res = await fetch(`http://localhost:8000/fields/form/${formId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) throw new Error("Erreur lors du chargement des champs")

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Erreur de récupération des champs:", error)
    return []
  }
}
