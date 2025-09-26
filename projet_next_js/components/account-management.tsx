import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { addManager } from "@/actions/addManager"
import { updateManager } from "@/actions/updateManager"

interface Manager {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
}

export function AccountManagement() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingManager, setEditingManager] = useState<Manager | null>(null)
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  })

  const handleAddManager = () => {
    setEditingManager(null)
    setFormData({ firstname: "", lastname: "", email: "", password: "",phone: "" })
    setIsDialogOpen(true)
  }

  const handleEditManager = (manager: Manager) => {
    setEditingManager(manager)
    setFormData({
      firstname: manager.firstname,
      lastname: manager.lastname,
      email: manager.email,
      phone: manager.phone,
      password: "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Utilisateur non authentifié");
    return;
  }

  let response;
  if (editingManager) {
    response = await updateManager(editingManager.id, formData, token); // ✅ passe le token
  } else {
    response = await addManager(formData, token); // ✅ passe le token
  }

  if (response.success) {
    setIsDialogOpen(false);
    fetchManagers(); // ✅ recharge la liste
  } else {
    alert(response.message);
  }
};


 const fetchManagers = async () => {
  try {
    const token = localStorage.getItem("token"); // 🔐 récupère le token

    if (!token) {
      console.error("Aucun token trouvé. L'utilisateur n'est peut-être pas connecté.");
      return;
    }

    const res = await fetch("http://localhost:8000/managers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ ajoute le token ici
      },
    });

    if (!res.ok) {
      throw new Error("Erreur lors du chargement des gestionnaires");
    }

    const data = await res.json();
    setManagers(data);
  } catch (err) {
    console.error("Erreur de chargement des gestionnaires :", err);
  }
};

useEffect(() => {
  fetchManagers();
}, []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des comptes</h1>
          <p className="text-muted-foreground">Gérez les comptes des gestionnaires CNRST</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un gestionnaire
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingManager ? "Modifier le gestionnaire" : "Ajouter un gestionnaire"}</DialogTitle>
                <DialogDescription>
                  {editingManager
                    ? "Modifiez les informations du gestionnaire."
                    : "Ajoutez un nouveau gestionnaire à votre organisation."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="lastname">Nom</Label>
                  <Input
                    id="lastname"
                    value={formData.lastname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="firstname">Prénom</Label>
                  <Input
                    id="firstname"
                    value={formData.firstname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  
                </div>

                 <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                {!editingManager && (
                  <div className="grid gap-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="submit">{editingManager ? "Modifier" : "Ajouter"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.id}>
                <TableCell className="font-medium">{manager.firstname}</TableCell>
                <TableCell>{manager.lastname}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{manager.phone}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleEditManager(manager)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
