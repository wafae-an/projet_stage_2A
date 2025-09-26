export async function getRecruitmentFormsByStatus(status: string) {
  let queryParam = "";

  if (status === "soumis") {
    queryParam = "?status=1";
  } else if (status === "non-soumis") {
    queryParam = "?status=0";
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/forms/recrutement${queryParam}`;
  console.log("📦 URL appelée :", url);
  console.log("🌍 Valeur de NEXT_PUBLIC_API_URL :", process.env.NEXT_PUBLIC_API_URL);

  const token = localStorage.getItem("token"); // ✅ récupération du token

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Authorization": `Bearer ${token}`, // ✅ ajout de l'authentification
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erreur HTTP :", res.status, res.statusText);
      console.error("❌ Détail de la réponse :", errorText);
      throw new Error("Erreur lors du chargement des formulaires");
    }

    const data = await res.json();
    console.log("✅ Formulaires reçus :", data);
    return data;

  } catch (error) {
    console.error("🔥 Problème pendant la requête :", error);
    throw error;
  }
}
