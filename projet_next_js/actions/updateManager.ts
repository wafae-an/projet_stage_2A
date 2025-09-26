"use server"

export async function updateManager(id: number, updatedData: any,token: string) {
  try {
    const res = await fetch(`http://localhost:8000/managers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.detail || "Erreur lors de la mise à jour." };
    }

    return { success: true, message: "Gestionnaire mis à jour avec succès." };
  } catch (error) {
    return { success: false, message: "Erreur réseau." };
  }
}
