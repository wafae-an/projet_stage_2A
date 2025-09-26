'use server'

export async function getExpertInvitations(form_id: string, invitation_status: string,token: string) {
  const queryParams = new URLSearchParams({
    form_id: form_id,                 
    status: invitation_status        
  });

  const url = `${process.env.NEXT_PUBLIC_API_URL}/invitations/experts?${queryParams.toString()}`;
  console.log("📨 URL envoyée :", url);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erreur lors de la récupération :", res.statusText);
      console.error("🛑 Détail :", errorText);
      throw new Error("Erreur de récupération des invitations");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("🔥 Erreur dans getExpertInvitations:", error);
    throw error;
  }
}
