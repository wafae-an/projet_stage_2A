import { Badge } from "@/components/ui/badge"

interface InvitationStatusBadgeProps {
  status: number | null
}

export function InvitationStatusBadge({ status }: InvitationStatusBadgeProps) {
  if (status === 1) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Utilisée
      </Badge>
    )
  } else if (status === -1) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        Non complète
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        Non utilisée
      </Badge>
    )
  }
}
