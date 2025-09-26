"use client"

import * as React from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getManagersClient} from "@/actions/getManagersClient"
import { getOrganizationsByManager } from "@/actions/getOrganizationByManager"
import { useEffect, useState } from "react"
import { saveOrganizationsForManager } from "@/actions/saveOrganizations"

interface Manager {
  id: number
  firstname: string
  lastname: string
  email: string
}

interface Organization {
  id: number
  name: string
  type: string
}

export function OrganizationAssignment() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [selectedManager, setSelectedManager] = useState<string>("")
  const [selectedManagerData, setSelectedManagerData] = useState<Manager | null>(null)
  const [assignedOrganizations, setAssignedOrganizations] = useState<Organization[]>([])
  const [availableOrganizations, setAvailableOrganizations] = useState<Organization[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  const handleOrganizationToggle = (organizationId: number, isAssigned: boolean) => {
    if (!selectedManager) return

    const orgToToggle = isAssigned
      ? assignedOrganizations.find((org) => org.id === organizationId)
      : availableOrganizations.find((org) => org.id === organizationId)

    if (!orgToToggle) return

    if (isAssigned) {
      setAssignedOrganizations((prev) => prev.filter((org) => org.id !== organizationId))
      setAvailableOrganizations((prev) => [...prev, orgToToggle])
    } else {
      setAvailableOrganizations((prev) => prev.filter((org) => org.id !== organizationId))
      setAssignedOrganizations((prev) => [...prev, orgToToggle])
    }

    setHasChanges(true)
  }

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token"); // ou ton système d’auth

    if (!token) {
      alert("Utilisateur non authentifié");
      return;
    }

    await saveOrganizationsForManager(
      Number(selectedManager),
      assignedOrganizations.map((org) => org.id),
      token // ✅ Passe le token ici
    );

    setHasChanges(false);
    alert("✅ Affectations sauvegardées avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde :", error);
    alert("Erreur lors de la sauvegarde des affectations.");
  }
};

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await getManagersClient()
        setManagers(data)
      } catch (error) {
        console.error("Erreur lors du chargement des gestionnaires", error)
      }
    }
    fetchManagers()
  }, [])

useEffect(() => {
  const fetchOrganizations = async () => {
    if (!selectedManager) return

    try {
      const token = localStorage.getItem("token") || ""
      const data = await getOrganizationsByManager(Number(selectedManager), token)
      setAssignedOrganizations(data.assigned)
      setAvailableOrganizations(data.available)
      setSelectedManagerData(managers.find((m) => m.id === Number(selectedManager)) || null)
    } catch (error) {
      console.error("Erreur lors de la récupération des organisations", error)
    }
  }

  fetchOrganizations()
}, [selectedManager, managers])


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affectation des organisations</h1>
          <p className="text-muted-foreground">Gérez les affectations d'organisations aux gestionnaires</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les affectations
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sélection du gestionnaire</CardTitle>
          <CardDescription>
            Choisissez un gestionnaire pour voir et modifier ses affectations d'organisations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="manager-select">Gestionnaire</Label>
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger id="manager-select">
                <SelectValue placeholder="Sélectionner un gestionnaire" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id.toString()}>
                    {manager.firstname} {manager.lastname} ({manager.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedManager && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Organisations disponibles</CardTitle>
              <CardDescription>
  Organisations non affectées à {selectedManagerData ? `${selectedManagerData.firstname} ${selectedManagerData.lastname}` : ""}
</CardDescription>

            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableOrganizations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Toutes les organisations sont déjà affectées à ce gestionnaire.
                  </p>
                ) : (
                  availableOrganizations.map((org) => (
                    <div key={org.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`available-${org.id}`}
                        checked={false}
                        onCheckedChange={() => handleOrganizationToggle(org.id, false)}
                      />
                      <Label htmlFor={`available-${org.id}`} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-muted-foreground">{org.type}</div>
                        </div>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organisations affectées</CardTitle>
              <CardDescription>Organisations actuellement affectées à {selectedManagerData ? `${selectedManagerData.firstname} ${selectedManagerData.lastname}` : ""}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignedOrganizations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune organisation affectée à ce gestionnaire.</p>
                ) : (
                  assignedOrganizations.map((org) => (
                    <div key={org.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`assigned-${org.id}`}
                        checked={true}
                        onCheckedChange={() => handleOrganizationToggle(org.id, true)}
                      />
                      <Label htmlFor={`assigned-${org.id}`} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-muted-foreground">{org.type}</div>
                        </div>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedManager && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé des affectations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <strong>{selectedManagerData ? `${selectedManagerData.firstname} ${selectedManagerData.lastname}` : ""}</strong> a actuellement <strong>{assignedOrganizations.length}</strong>{" "}
              organisation(s) affectée(s) :
              <ul className="mt-2 list-disc list-inside space-y-1">
                {assignedOrganizations.map((org) => (
                  <li key={org.id}>
                    {org.name} ({org.type})
                  </li>
                ))}
              </ul>
              {assignedOrganizations.length === 0 && (
                <p className="mt-2 text-muted-foreground">Aucune organisation affectée.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
