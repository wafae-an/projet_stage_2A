"use client"

import * as React from "react"
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

import {getRecruitmentFormsByStatus } from "@/actions/getRecruitmentFormsByStatus";
import { getFormDataClient} from "@/actions/getFormDataClient";

import {getFieldsByForm } from "@/actions/getFileds";
import { getFormStats, ApplicationStats } from "@/actions/getFormStatsRecruite";


import {
  FileText,
  Download,
  Users,
  Mail,
  GraduationCap,
  BarChart3,
  Grid3X3,
  List,
  Search,
  Filter,
  Eye,
  Settings,
  Brain,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Formulaires disponibles selon le statut


// Champs disponibles selon le formulaire


type Field = {
  id: number
  caption: string
  checked: boolean
}

type ValueStat = {
  value: string;
  count: number;
};

type ChampStat = {
  field: string;
  values: ValueStat[];
};



export function ExpertRecruitment() {
const [submissionStatus, setSubmissionStatus] = useState<string>("");
const [availableFormsForStatus, setAvailableFormsForStatus] = useState<
  { id: string; name: string; type: number; status:number}[]
>([]);

const [loadingForms, setLoadingForms] = useState(false);

  const [selectedForm, setSelectedForm] = React.useState("")
  const [candidatureType, setCandidatureType] = React.useState("")
  const [fields, setFields] = useState<Field[]>([])
  const [candidatureData, setCandidatureData] = useState<any[]>([]) 

   const [champStats, setChampStats] = useState<ChampStat[]>([]);
  



  // États pour les options d'affichage
  const [viewMode, setViewMode] = React.useState<"table" | "cards">("table")
  const [itemsPerPage, setItemsPerPage] = React.useState("10")
  const [sortBy, setSortBy] = React.useState("name")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = React.useState("")

  // États pour les nouvelles options d'affichage
  const [showFiles, setShowFiles] = React.useState(true)
  const [showGlobalStats, setShowGlobalStats] = React.useState(true)
  const [showCandidateDetails, setShowCandidateDetails] = React.useState(true)
  const [showFieldStats, setShowFieldStats] = React.useState(false)
  const [selectedFields, setSelectedFields] = useState<Field[]>([])
  const [filteredExperts, setFilteredExperts] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
   const [stats, setStats] = useState<ApplicationStats | null>(null);
   const [error, setError] = useState<string | null>(null);
    const [formType, setFormType] = React.useState("")



  // Réinitialiser les sélections suivantes quand une étape précédente change
  React.useEffect(() => {
    setSelectedForm("")
    setCandidatureType("")
    setFields([])
  }, [submissionStatus])

 

  const handleFieldChange = (fieldId: number, checked: boolean) => {
  const updatedFields = fields.map((field) =>
    field.id === fieldId ? { ...field, checked } : field
  )

  setFields(updatedFields)
  setSelectedFields(updatedFields.filter((field) => field.checked))
}


  const selectedFormData = availableFormsForStatus.find((form) => form.id === selectedForm)
 

  // Filtrer les experts selon les critères


  

  useEffect(() => {
  if (!submissionStatus) return;

  const fetchForms = async () => {
    setLoadingForms(true);
    try {
      const forms = await getRecruitmentFormsByStatus(submissionStatus);
      setAvailableFormsForStatus(forms);
    } catch (error) {
      console.error("Erreur lors du chargement des formulaires :", error);
    } finally {
      setLoadingForms(false);
    }
  };

  fetchForms();
}, [submissionStatus])




useEffect(() => {
  if (!selectedForm) return;

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token non trouvé !");
    return;
  }

  getFieldsByForm(Number(selectedForm), token).then((data) => {
    const formatted = data.map((field: { id: number; caption: string }) => ({
      ...field,
      checked: false,
    }));
    setFields(formatted);
  });
}, [selectedForm]);







 useEffect(() => {
  const fetchData = async () => {
    if (selectedForm && selectedFields.length > 0 && candidatureType) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token non trouvé !");
        return;
      }

      const formId = Number(selectedForm);
      const fieldIds = selectedFields.map((f) => f.id);

      const data = await getFormDataClient(formId, fieldIds, candidatureType, formType, token);

      const results = data.results;
      setFilteredExperts(results);
      setShowResults(true);

      // Construire les stats par champ
      const stats: ChampStat[] = selectedFields.map((field) => {
        const counts: { [key: string]: number } = {};

        results.forEach((item: any) => {
          const value = item[field.id];
          if (value) {
            counts[value] = (counts[value] || 0) + 1;
          }
        });

        const values = Object.entries(counts).map(([val, count]) => ({
          value: val,
          count,
        }));

        return {
          field: field.caption,
          values,
        };
      });

      setChampStats(stats);
    }
  };

  fetchData();
}, [selectedForm, selectedFields, candidatureType, formType]);




useEffect(() => {
  // S'assurer qu'un formulaire est sélectionné
  if (!selectedForm) return;

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token non trouvé !");
        return;
      }

      const formId = parseInt(selectedForm);
      if (isNaN(formId)) return;

      const data = await getFormStats(formId, token);
      setStats(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des statistiques.");
      console.error(err);
    }
  };

  fetchStats();
}, [selectedForm]);


function exportToCSV(
  data: any[],
  filename: string,
  selectedFields: Field[]
) {
  if (!data.length) return;

  // Toutes les clés disponibles dans les objets (ex: id, name, 4001, etc.)
  const allKeys = Object.keys(data[0]);

  // Forcer "name" à apparaître en premier, puis le reste
  const exportKeys = ["candidature_id","name", "email", ...allKeys.filter(k => k !== "candidature_id" && k !== "name" && k !== "email")];


  // Créer une map pour remplacer certains nom s techniques par des captions
  const captionMap = Object.fromEntries(
    selectedFields.map((field) => [field.id, field.caption])
  );

  // Générer les en-têtes : utiliser caption si disponible, sinon garder la clé brute
  const headers = exportKeys.map((key) => captionMap[key] || key).join(",");

  // Générer les lignes de données
  const rows = data.map((row) =>
    exportKeys
      .map((key) => {
        const value = row[key];
        return `"${String(value ?? "").replace(/"/g, '""')}"`
      })
      .join(",")
  );

  // Contenu CSV complet
  const csvContent = [headers, ...rows].join("\n");

  // Déclencher le téléchargement
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
}





  return (
    <div className="space-y-6">
      {/* Étape 1 : Statut de soumission - Toujours visible */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Filter className="h-5 w-5" />
            Étape 1 : Statut de soumission des formulaires
          </CardTitle>
          <CardDescription>
            Sélectionnez d'abord le statut des formulaires que vous souhaitez visualiser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={submissionStatus} onValueChange={setSubmissionStatus}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choisir le statut de soumission..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soumis">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Formulaires soumis
                </div>
              </SelectItem>
              <SelectItem value="non-soumis">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Formulaires non soumis
                </div>
              </SelectItem>
              <SelectItem value="tous">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Tous les formulaires
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Étape 2 : Sélection du formulaire */}
      {submissionStatus && (
        <Card className="border-l-4 border-l-blue-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Étape 2 : Sélection du formulaire de recrutement
            </CardTitle>
            <CardDescription>
              Formulaires disponibles pour le statut : <Badge variant="outline">{submissionStatus}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedForm} onValueChange={setSelectedForm}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un formulaire..." />
              </SelectTrigger>
              <SelectContent>
                {availableFormsForStatus.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{form.name}</span>
                      
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedFormData && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">{selectedFormData.name}</h4>
                  
                  </div>
                  <div className="text-right">
                   
                    <div className="text-xs text-blue-700">candidatures</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Étape 3 : Type de candidatures */}
      {selectedForm && (
        <Card className="border-l-4 border-l-green-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Étape 3 : Type de candidatures
            </CardTitle>
            <CardDescription>Filtrer les candidatures selon leur statut de soumission</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={candidatureType} onValueChange={setCandidatureType}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50 transition-colors">
                  <RadioGroupItem value="submitted" id="soumises" />
                  <Label htmlFor="soumises" className="flex-1 cursor-pointer">
                    <div className="font-medium">Submitted</div>
                    <div className="text-sm text-muted-foreground">Dossiers complets</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-orange-50 transition-colors">
                  <RadioGroupItem value="not_submitted" id="non-soumises" />
                  <Label htmlFor="non-soumises" className="flex-1 cursor-pointer">
                    <div className="font-medium">Not Submitted</div>
                    <div className="text-sm text-muted-foreground">Dossiers en cours</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                  <RadioGroupItem value="all" id="toutes-candidatures" />
                  <Label htmlFor="toutes-candidatures" className="flex-1 cursor-pointer">
                    <div className="font-medium">All</div>
                    <div className="text-sm text-muted-foreground">Tous les statuts</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {selectedForm && candidatureType && fields.length > 0 && (
     <Card className="border-l-4 border-l-purple-500 animate-in slide-in-from-top-5 duration-500">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Eye className="h-5 w-5 text-purple-600" />
        Étape 4 : Champs à afficher
      </CardTitle>
      <CardDescription>Sélectionnez les informations que vous souhaitez voir dans les résultats</CardDescription>
    </CardHeader>
    <CardContent>
  <div className="space-y-4">
    <select
      multiple
      className="w-full border rounded px-3 py-2 h-48"
      value={selectedFields.map((field) => field.id.toString())}
      onChange={(e) => {
        const selectedIds = Array.from(e.target.selectedOptions).map((opt) => parseInt(opt.value))
        const updated = fields.map((field) => ({
          ...field,
          checked: selectedIds.includes(field.id),
        }))
        setFields(updated)
        setSelectedFields(updated.filter((f) => f.checked))
      }}
    >
      {fields.map((field) => (
        <option key={field.id} value={field.id}>
          {field.caption}
        </option>
      ))}
    </select>
  </div>

  {selectedFields.length > 0 && (
    <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
      <div className="text-sm font-medium text-purple-900 mb-2">
        Champs sélectionnés ({selectedFields.length}) :
      </div>
      <div className="flex flex-wrap gap-1">
        {selectedFields.map((field) => (
          <Badge key={field.id} variant="secondary" className="text-xs">
            {field.caption}
          </Badge>
        ))}
      </div>
    </div>
  )}
</CardContent>

  </Card>
)}

      {/* Étape 5 : Options d'affichage */}
      {selectedFields.length > 0 && (
        <Card className="border-l-4 border-l-orange-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              Étape 5 : Options d'affichage
            </CardTitle>
            <CardDescription>Personnalisez l'affichage des résultats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Options d'affichage principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Mode d'affichage */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Mode d'affichage</Label>
                  <RadioGroup value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="table" id="table-view" />
                      <Label htmlFor="table-view" className="flex items-center gap-2 cursor-pointer">
                        <List className="h-4 w-4" />
                        Tableau
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cards" id="cards-view" />
                      <Label htmlFor="cards-view" className="flex items-center gap-2 cursor-pointer">
                        <Grid3X3 className="h-4 w-4" />
                        Cartes
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Separator />

              {/* Options d'affichage avancées */}
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Options d'affichage avancées
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <Label htmlFor="show-files" className="text-sm font-medium cursor-pointer">
                        Fichiers déposés
                      </Label>
                    </div>
                    <Switch id="show-files" checked={showFiles} onCheckedChange={setShowFiles} />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <Label htmlFor="show-candidate-details" className="text-sm font-medium cursor-pointer">
                        Détails candidat
                      </Label>
                    </div>
                    <Switch
                      id="show-candidate-details"
                      checked={showCandidateDetails}
                      onCheckedChange={setShowCandidateDetails}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <Label htmlFor="show-global-stats" className="text-sm font-medium cursor-pointer">
                        Statistiques globales
                      </Label>
                    </div>
                    <Switch id="show-global-stats" checked={showGlobalStats} onCheckedChange={setShowGlobalStats} />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-orange-600" />
                      <Label htmlFor="show-field-stats" className="text-sm font-medium cursor-pointer">
                        Statistiques par champ
                      </Label>
                    </div>
                    <Switch id="show-field-stats" checked={showFieldStats} onCheckedChange={setShowFieldStats} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques globales */}
      {showResults && showGlobalStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-in slide-in-from-top-5 duration-500">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total candidats</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-muted-foreground">candidats trouvés</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatures soumises</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.submitted}
              </div>
              <p className="text-xs text-muted-foreground">
    {Math.round((stats.submitted / stats.total) * 100)}% du total
  </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.not_submitted}
              </div>
              <p className="text-xs text-muted-foreground">
    {Math.round((stats.not_submitted / stats.total) * 100)}% du total
  </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avec documents</CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.with_documents}
              </div>
              <p className="text-xs text-muted-foreground">
    {Math.round((stats.with_documents / stats.total) * 100)}% du total
  </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Résultats */}
      {showResults && (
        <Card className="animate-in slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Résultats
                </CardTitle>
                <CardDescription>
                  {filteredExperts.length} candidat(s) trouvé(s) • {candidatureType}  
                </CardDescription>
              </div>
                <Button
  variant="outline"
  size="sm"
  onClick={() => exportToCSV(filteredExperts, "experts.csv", selectedFields)}
>
  <Download className="h-4 w-4 mr-2" />
  Exporter
</Button>



            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <Table>
              <TableHeader>
  <TableRow>
    {showCandidateDetails && <TableHead className="w-[250px]">Candidat</TableHead>}
    {selectedFields.map((field) => (
      <TableHead key={field.id}>{field.caption}</TableHead>
    ))}
    <TableHead>Statut</TableHead>
    {showFiles && <TableHead>Documents</TableHead>}
  </TableRow>
</TableHeader>

                <TableBody>
                  {filteredExperts.map((expert) => (
                    <TableRow key={expert.id} className="hover:bg-muted/50">
                      {showCandidateDetails && (
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage  alt={expert.name} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {expert.name
  .split(" ")
  .map((n: string) => n[0])
  .join("")}

                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{expert.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {expert.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {selectedFields.map((field) => (
                        <TableCell key={field.id} className="max-w-[200px] truncate">
                          {expert[field.id as keyof typeof expert] || "-"}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Badge variant={expert.candidature_status === "Soumise" ? "default" : "secondary"}>
                          {expert.candidature_status}
                        </Badge>
                      </TableCell>
                      {showFiles && (
  <TableCell>
    <div className="flex flex-col gap-1">
      {expert.files && expert.files.length > 0 ? (
        expert.files.map((file: any) => (
          <a
            key={file.file_id}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            📄 {file.name || `Fichier ${file.file_id}`}
          </a>
        ))
      ) : (
        <span className="text-muted-foreground text-sm">Aucun fichier</span>
      )}
    </div>
  </TableCell>
)}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExperts.map((expert) => (
                  <Card key={expert.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                           {expert.name
  .split(" ")
  .map((n: string) => n[0])
  .join("")}

                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{expert.name}</h4>
                          <p className="text-sm text-muted-foreground">{expert.email}</p>
                        </div>
                        <Badge variant={expert.candidature_status === "Soumise" ? "default" : "secondary"}>
                          {expert.candidature_status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedFields.map((field) => (
                        <div key={field.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{field.caption}:</span>
                          <span className="font-medium truncate ml-2">
                            {expert[field.id as keyof typeof expert] || "-"}
                          </span>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        {expert.hasCV && (
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            CV
                          </Button>
                        )}
                        {expert.hasDiplomas && (
                          <Button variant="outline" size="sm">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            Diplômes
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistiques par champ */}
      {showResults && showFieldStats && (
  <Card className="animate-in slide-in-from-bottom-5 duration-500">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Statistiques détaillées par champ
      </CardTitle>
      <CardDescription>Analyse des données selon les champs sélectionnés</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {champStats.map((champ) => (
          <div
            key={champ.field}
            className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
          >
            <h4 className="font-medium text-slate-900">{champ.field}</h4>
            <div className="text-sm space-y-2">
              {champ.values.map((val) => (
                <div
                  key={val.value}
                  className="flex justify-between items-center"
                >
                  <span className="text-slate-700">{val.value}</span>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                    {val.count} experts
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}

    </div>
  )
}
