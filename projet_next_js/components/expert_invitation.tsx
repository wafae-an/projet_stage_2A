"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink } from "lucide-react"
import {getRecruitmentFormsByStatus } from "@/actions/getRecruitmentFormsByStatus"
import { getExpertInvitations } from "@/actions/get_experts_invitations";


// Types
interface Invitation {
  id: number
  managerId: number
  managerName: string
  invitationHash: string
  expertEmail: string
  status: number
}



// Données mockées pour les formulaires d'évaluation (type 2, statut 1)


// Données mockées pour les invitations


const statusOptions = [
  { value: "all", label: "Toutes les invitations" },
  { value: "used", label: "Invitation utilisée" },
  { value: "incomplete", label: "Invitation non complète" },
  { value: "unused", label: "Invitation non utilisée" },
]

export default function ExpertInvitations() {
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedForm, setSelectedForm] = useState<string>("")
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [showResults, setShowResults] = useState(false)
  const [RegistrationForms, setRegistrationForms] = useState<
    { id: string; name: string; type: number; status:number}[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulation de vérification si l'utilisateur est administrateur
  const isAdmin = true // À remplacer par votre logique d'authentification



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optionnel : afficher une notification
      console.log("Hash copié dans le presse-papiers !")
    })
  }



  const getStatusBadge = (status: number | null) => {
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

  const generateInvitationUrl = (hash: string) => {
    return `/invitation/${hash}`
  }

  useEffect(() => {
  async function fetchForms() {
    try {
      const data = await getRecruitmentFormsByStatus("soumis");
      setRegistrationForms(data);
    } catch (err) {
      setError("Erreur lors de la récupération des formulaires.");
    } finally {
      setLoading(false);
    }
  }

  fetchForms();
}, []);


const changementInvitations = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token non trouvé !");
      return;
    }

    const result = await getExpertInvitations(selectedForm, selectedStatus, token);
    setInvitations(result);
    setShowResults(true);
    console.log("Invitations récupérées :", result);
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations :", error);
  }
};



  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consultation des Invitations d'Experts</CardTitle>
          <CardDescription>
            Filtrez et consultez les invitations envoyées aux experts selon leur statut et formulaire d'évaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut de l'invitation</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Formulaire d'évaluation</label>
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un formulaire" />
                </SelectTrigger>
                <SelectContent>
                  
                  {RegistrationForms.map((form) => (
                    <SelectItem key={form.id} value={form.id.toString()}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={changementInvitations} className="w-full md:w-auto">
              Valider
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>
              Résultats ({invitations.length} invitation{invitations.length > 1 ? "s" : ""})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Invitation</TableHead>
                    {isAdmin && <TableHead>ID Gestionnaire</TableHead>}
                    <TableHead>Nom Gestionnaire</TableHead>
                    <TableHead>Lien d'invitation</TableHead>
                    <TableHead>Email Expert</TableHead>
                    <TableHead>Statut</TableHead>
    
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-8 text-muted-foreground">
                        Aucune invitation trouvée avec ces critères
                      </TableCell>
                    </TableRow>
                  ) : (
                    invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">#{invitation.id}</TableCell>
                        {isAdmin && <TableCell className="text-muted-foreground">{invitation.managerId}</TableCell>}
                        <TableCell className="font-medium">{invitation.managerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {invitation.invitationHash.substring(0, 12)}...
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(invitation.invitationHash)}
                              title="Copier le hash complet"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(generateInvitationUrl(invitation.invitationHash), "_blank")}
                              title="Ouvrir le lien d'invitation"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{invitation.expertEmail}</TableCell>
                        
                        <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                        
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
