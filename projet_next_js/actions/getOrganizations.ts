"use server";

export async function getOrganizations() {
  try {
    const res = await fetch("http://localhost:8000/organizations", {
      cache: "no-store", // important si tu veux éviter la mise en cache
    });

    if (!res.ok) throw new Error("Erreur lors de la récupération des organisations");

    const data = await res.json();
    return data; // attend un tableau d’objets : [{ id, name, type }, ...]
  } catch (error) {
    console.error("Erreur fetch organizations:", error);
    return [];
  }
}
