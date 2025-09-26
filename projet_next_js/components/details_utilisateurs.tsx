"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink } from "lucide-react"
import { getUsers, User } from "@/actions/get_users"


// Types


// Données mockées


const roles = ["Tous", "Porteurs", "Experts", "Gestionnaires", "Administrateurs", "Utilisateurs"]


export default function UserConsultation() {
  const [selectedRole, setSelectedRole] = useState<string>("Tous")
  const [selectedStatus, setSelectedStatus] = useState<number>(1)
  const [users, setUsers] = useState<User[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)





   

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const showExpertColumn = selectedRole === "Experts"
 
  const fetchUsers = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem("token"); // 🔐 Récupération du token depuis localStorage

    if (!token) {
      alert("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    const data = await getUsers(selectedRole, selectedStatus, token); // ✅ Passe le token ici
    setUsers(data);
    setShowResults(true);
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs :", error);
    alert("Erreur de récupération des utilisateurs");
  } finally {
    setLoading(false);
  }
};

 

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consultation des utilisateurs</CardTitle>
          <CardDescription>
            Filtrez et consultez la liste des utilisateurs selon leur rôle et statut de confirmation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrer par rôle</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrer par confirmation</label>
             <Select value={selectedStatus.toString()} onValueChange={(value) => setSelectedStatus(Number(value))}>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionner un statut" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Confirmé</SelectItem>
    <SelectItem value="0">Non Confirmé</SelectItem>
  </SelectContent>
</Select>

            </div>

           <Button onClick={fetchUsers} className="w-full md:w-auto">
  Rechercher
</Button>

          </div>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>
              Résultats ({users.length} utilisateur{users.length > 1 ? "s" : ""})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User_id</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Pays</TableHead>
                    <TableHead>Rôles</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Confirmé</TableHead>
                    <TableHead>Date de confirmation</TableHead>
                    <TableHead>Token de validation</TableHead>
                    {showExpertColumn && <TableHead>Expert validé pour évaluation</TableHead>}
                    
                  </TableRow>
                </TableHeader>
                <TableBody>
  {users.length === 0 ? (
    <TableRow>
      <TableCell
        colSpan={showExpertColumn ? 12 : 11}
        className="text-center py-8 text-muted-foreground"
      >
        Aucun utilisateur trouvé avec ces critères
      </TableCell>
    </TableRow>
  ) : (
    users.map((user) => (
      <TableRow key={user.id}>
        <TableCell >{user.id}</TableCell>
        <TableCell className="font-medium">{user.firstname}</TableCell>
        <TableCell>{user.lastname}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.phone}</TableCell>
        <TableCell>{user.organism}</TableCell>
        <TableCell>{user.country}</TableCell>
        <TableCell>
          {
            user.roles
          }
        </TableCell>
        <TableCell>{formatDate(user.created)}</TableCell>
        <TableCell>
          <Badge variant={user.confirmed ? "default" : "destructive"}>
            {user.confirmed ? "Oui" : "Non"}
          </Badge>
        </TableCell>
        <TableCell>{user.confirmed_on ? formatDate(user.confirmed_on) : "-"}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded">{user.token}</code>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.token)}>
              <Copy className="h-3 w-3" />
            </Button>
            
          </div>
        </TableCell>
        {showExpertColumn && (
          <TableCell>
            <Badge variant={user.is_jury ? "default" : "destructive"}>
              {user.is_jury ? "Oui" : "Non"}
            </Badge>
          </TableCell>
        )}
       
      </TableRow>
    ))
  )}
</TableBody>

              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

