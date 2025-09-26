"use server";

export async function toggleManagerStatus(id: number, currentStatus: "active" | "inactive") {
  try {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const res = await fetch(`http://localhost:8000/managers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, message: error.detail || "Erreur de mise à jour du statut." };
    }

    return { success: true, newStatus };
  } catch (error) {
    return { success: false, message: "Erreur réseau." };
  }
}
