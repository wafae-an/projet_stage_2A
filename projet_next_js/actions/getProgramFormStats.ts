// getProgramFormStats.ts
export interface ProgramFormStats {
  submitted: number;
  not_submitted: number;
  
}

export async function getProgramFormStats(programId: string): Promise<ProgramFormStats> {
  try {
    const token = localStorage.getItem("token")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/forms?program_id=${programId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Server error: ${res.status} – ${errorText}`);
    }

    const data = await res.json();
    return data as ProgramFormStats;
  } catch (error) {
    console.error("❌ Failed to fetch program stats:", error);
    throw error;
  }
}
