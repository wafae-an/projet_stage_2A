import { redirect } from "next/navigation"

export default function AdminPage() {
  redirect("/admin/accounts") // Redirige automatiquement vers la page par défaut
}
