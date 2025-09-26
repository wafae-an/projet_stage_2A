"use client"

import * as React from "react"
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Building2,
  BookOpen,
  FileText,
  Layers,
  Target,
  Users,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  GraduationCap,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Mail, X } from "lucide-react"
import {
  getAssignedOrganizations,
  Organization,
} from "@/actions/get_organization_assigned_to_connected_manager";
import { getProgramsByOrganizationId } from "@/actions/get_programme";
import { getFormsByTypeStatusAndProgram } from "@/actions/get_forms_by_status_type_program";
import { getFormsByTypeAndStatus} from "@/actions/get_forms_by_status_type";
import { getFieldsByForm } from "@/actions/getFileds";
import { getFormDataClient } from "@/actions/getFormDataClient";
import { getFormStats, ApplicationStats } from "@/actions/getFormStatsRecruite";
import { getProgramFormStats, ProgramFormStats } from "@/actions/getProgramFormStats";





interface Program {
  id: number;
  name: string;
  organization_id: number;
}

type Field = {
  id: number;
  caption: string;
  checked: boolean;
};

type ValueStat = {
  value: string;
  count: number;
};

type ChampStat = {
  field: string;
  values: ValueStat[];
};



export function FormsVisualization_2() {
  // Navigation state
  const [currentStep, setCurrentStep] = React.useState(1)



  const [selectedOrganization, setSelectedOrganization] = React.useState<string | number | null>(null);
  
    const [forms, setForms] = useState<any[]>([]);
    const [selectedProgram, setSelectedProgram] = React.useState("");
    const [formStatus, setFormStatus] = React.useState("");
    const [formType, setFormType] = React.useState("");
    const [selectedForm, setSelectedForm] = React.useState("");
    const [candidatureType, setCandidatureType] = React.useState("");
    const [candidatureData, setCandidatureData] = useState<any[]>([]);


  const [applicationStatus, setApplicationStatus] = React.useState("")


  // Display options
  const [showUploadedFiles, setShowUploadedFiles] = React.useState(true)
  const [showCandidateDetails, setShowCandidateDetails] = React.useState(true)
  const [showGlobalStats, setShowGlobalStats] = React.useState(true)
  const [showFieldStats, setShowFieldStats] = React.useState(false)
  const [showProjectOwner, setShowProjectOwner] = React.useState(false)

  // État pour l'affichage des résultats
  const [showResults, setShowResults] = React.useState(false)
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [fields, setFields] = useState<Field[]>([]);
    const [showFiles, setShowFiles] = React.useState(true);
    const [viewMode, setViewMode] = React.useState<"table" | "cards">("table");
    const [champStats, setChampStats] = useState<ChampStat[]>([]);
    const [stats, setStats] = useState<ProgramFormStats | null>(null);

    const [stats_1, setStats_1] = useState<ApplicationStats | null>(null);
     

    const [loading, setLoading] = useState<boolean>(false);


    const checkedFields = fields.filter((field) => field.checked);


  // Reset dependent selections when parent changes
  React.useEffect(() => {
    setSelectedProgram("")
    setFormStatus("")
    setFormType("")
    setSelectedForm("")
    setApplicationStatus("")
  }, [selectedOrganization])

  React.useEffect(() => {
    setFormStatus("")
    setFormType("")
    setSelectedForm("")
    setApplicationStatus("")
  }, [selectedProgram])





   useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token manquant");
        return;
      }
  
      getAssignedOrganizations(token)
        .then(setOrganizations)
        .catch((err) => setError(err.message));
    }, []);


      useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !selectedOrganization) return;
    
        getProgramsByOrganizationId(selectedOrganization, token).then((data) => {
          setPrograms(data);
        });
      }, [selectedOrganization]);


     useEffect(() => {
    const fetchStats = async () => {
      if (!selectedProgram) return; // Ne rien faire si aucun programme sélectionné

      setLoading(true);
      setError(null);

      try {
        const data = await getProgramFormStats(selectedProgram);
        setStats(data);
      } catch (err: any) {
        console.error(err);
        setError("Erreur lors de la récupération des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedProgram]);

  useEffect(() => {
    const fetchForms = async () => {
      const type = formType
      const status = formStatus
  
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("Token non trouvé. L'utilisateur n'est peut-être pas connecté.")
        return
      }
  
      if (type && status && selectedOrganization) {
        if (selectedProgram === "all") {
          const data = await getFormsByTypeAndStatus(type, status, selectedOrganization, token)
          setForms(data)
        } else {
          const programId = parseInt(selectedProgram)
          if (!isNaN(programId)) {
            const data = await getFormsByTypeStatusAndProgram(type, status, programId, token)
            setForms(data)
          }
        }
      }
    }
  
    if (selectedProgram && formType && formStatus && selectedOrganization) {
      fetchForms()
    }
  }, [selectedProgram, formType, formStatus, selectedOrganization])


   
  useEffect(() => {
   if (!selectedForm) return;
 
   const token = localStorage.getItem("token");
   if (!token) {
     console.error("Aucun token trouvé !");
     return;
   }
 
   getFieldsByForm(Number(selectedForm), token).then((data) => {
     const formatted = data.map((field: { id: number; caption: string }) => ({
       ...field,
       checked: false,
     }));
     setFields(formatted);
   }).catch((error) => {
     console.error("Erreur lors de la récupération des champs :", error);
   });
 }, [selectedForm]);
 



// Ajoute un petit état pour le chargement (optionnel)


const handleGenerateResults = async () => {
  // Garde une garde-fou sur les prérequis
  if (!selectedForm || checkedFields.length === 0 || !formType) return;

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token non trouvé");
    return;
  }

  try {
    setLoading(true);

    const formId = Number(selectedForm);
    const fieldIds = checkedFields.map((f) => f.id);

    const data = await getFormDataClient(
      formId,
      fieldIds,
      applicationStatus,   // ex: "submitted" | "not-submitted" | "all"
      formType,            // "application" | "evaluation"
      token
    );

    const results = data?.results ?? [];
    setCandidatureData(results);

    // ---- construire les stats par champ ----
    const stats = checkedFields.map((field) => {
      const counts: Record<string, number> = {};
      results.forEach((item: any) => {
        // ⚠️ Assure-toi que backend renvoie la valeur sous la clé field.id
        const value = item[field.id];
        if (value !== undefined && value !== null && value !== "") {
          counts[String(value)] = (counts[String(value)] || 0) + 1;
        }
      });
      return {
        field: field.caption,
        values: Object.entries(counts).map(([value, count]) => ({ value, count })),
      };
    });
    setChampStats(stats);

    // Afficher la vue résultats SEULEMENT une fois les données prêtes
    setShowResults(true);
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};



        function exportToCSV(data: any[], filename: string, checkedFields: Field[]) {
    if (!data.length) return;

    // Toutes les clés disponibles dans les objets (ex: id, name, 4001, etc.)
    const allKeys = Object.keys(data[0]);

    // Forcer "name" à apparaître en premier, puis le reste
    const exportKeys = [
      "candidature_id",
      "name",
      "email",
      ...allKeys.filter(
        (k) => k !== "candidature_id" && k !== "name" && k !== "email"
      ),
    ];

    // Créer une map pour remplacer certains nom s techniques par des captions
    const captionMap = Object.fromEntries(
      checkedFields.map((field) => [field.id, field.caption])
    );

    // Générer les en-têtes : utiliser caption si disponible, sinon garder la clé brute
    const headers = exportKeys.map((key) => captionMap[key] || key).join(",");

    // Générer les lignes de données
    const rows = data.map((row) =>
      exportKeys
        .map((key) => {
          const value = row[key];
          return `"${String(value ?? "").replace(/"/g, '""')}"`;
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
        

         useEffect(() => {
           if (!selectedForm) return;
         
           const fetchStats = async () => {
             try {
               const formId = parseInt(selectedForm);
               if (isNaN(formId)) return;
         
               const token = localStorage.getItem("token");
               if (!token) {
                 setError("Token non trouvé.");
                 return;
               }
         
               const data = await getFormStats(formId, token);
               setStats_1(data);
               setError(null);
             } catch (err) {
               setError("Erreur lors de la récupération des statistiques.");
               console.error(err);
             }
           };
         
           fetchStats();
         }, [selectedForm]);



  // Si les résultats sont affichés, afficher uniquement la section résultats
  if (showResults) {
    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Results Header */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Résultats de la Recherche</h1>
              <p className="text-slate-600">
                {
                 candidatureData.length
                }{" "}
                résultat(s) trouvé(s)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                exportToCSV(candidatureData, "candidatures.csv", checkedFields)
                              }
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Exporter
                            </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowResults(false)
                  setCurrentStep(1)
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Nouvelle recherche
              </Button>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Applied Filters Summary */}
            <Card className="bg-slate-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filtres Appliqués</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    Organisation: {organizations.find((o) => o.id === selectedOrganization)?.name}
                  </Badge>
                  {selectedProgram && selectedProgram !== "all" && (
                    <Badge variant="outline">
                      Programme: {programs.find((o) => o.id === Number(selectedProgram))?.name}
                    </Badge>
                  )}
                  {formStatus && (
                    <Badge variant="outline">
                      Statut formulaire:{" "}
                      {formStatus === "submitted" ? "Soumis" : formStatus === "not-submitted" ? "Non soumis" : "Tous"}
                    </Badge>
                  )}
                  {formType && (
                    <Badge variant="outline">Type: {formType === "application" ? "Candidature" : "Évaluation"}</Badge>
                  )}
                  {applicationStatus && (
                    <Badge variant="outline">
                      Candidatures:{" "}
                      {applicationStatus === "submitted"
                        ? "Soumises"
                        : applicationStatus === "not-submitted"
                          ? "Non soumises"
                          : "Toutes"}
                    </Badge>
                  )}
                  <Badge variant="outline">{checkedFields.length} champs sélectionnés</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Global Statistics */}
            {showGlobalStats && stats_1 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Candidatures</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                  {stats_1.total}
                                </div>
                                <p className="text-xs text-muted-foreground">candidats trouvés</p>
                              </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Soumises</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                  {stats_1.submitted}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {Math.round((stats_1.submitted / stats_1.total) * 100)}% du total
                                </p>
                              </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">En attente</CardTitle>
                    <XCircle className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                        <CardContent>
                                <div className="text-2xl font-bold text-orange-600">
                                  {stats_1.not_submitted}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {Math.round((stats_1.not_submitted / stats_1.total) * 100)}% du
                                  total
                                </p>
                              </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avec documents</CardTitle>
                    <FileText className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                 <CardContent>
                               <div className="text-2xl font-bold text-purple-600">
                                 {stats_1.with_documents}
                               </div>
                               <p className="text-xs text-muted-foreground">
                                 {Math.round((stats_1.with_documents / stats_1.total) * 100)}% du
                                 total
                               </p>
                             </CardContent>
                </Card>
              </div>
            )}

            {/* Results Table */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Tableau des Résultats
                </CardTitle>
                <CardDescription>Données filtrées selon vos critères de sélection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {showCandidateDetails && <TableHead className="w-[250px]">Candidat</TableHead>}
                        {checkedFields.map((field) => (
                          <TableHead key={field.id}>{field.caption}</TableHead>
                        ))}
                        <TableHead>Statut</TableHead>
                        {showUploadedFiles && <TableHead>Documents</TableHead>}
                        {formType === "evaluation" && showProjectOwner && <TableHead>Porteur de Projet</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidatureData.map((application) => (
                          <TableRow key={application.id} className="hover:bg-muted/50">
                            {showCandidateDetails && (
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      
                                      alt={application.name}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {application.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{application.name}</div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {application.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            )}
                            {checkedFields.map((field) => (
                              <TableCell key={field.id} className="max-w-[200px] truncate">
                                {application[field.id as keyof typeof application] || "-"}
                              </TableCell>
                            ))}
                            <TableCell>
                              <Badge variant={application.candidature_status === "Submitted" ? "default" : "secondary"}>
                                {application.candidature_status}
                              </Badge>
                            </TableCell>
                            {showUploadedFiles && (
                              <TableCell>
                                {application.hasFiles ? (
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" title="CV disponible">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <Button variant="ghost" size="sm" title="Diplômes disponibles">
                                      <GraduationCap className="h-4 w-4 text-green-600" />
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm">-</span>
                                )}
                              </TableCell>
                            )}
                            {formType === "evaluation" && showProjectOwner && (
                              <TableCell>
                                <div className="text-sm">
                                   <div className="text-xs text-muted-foreground">
                                    {application.project_owner_id}
                                  </div>
                                  <div className="font-medium">{application.project_owner}</div>
                                  <div className="text-muted-foreground">{application.project_owner_email}</div>
                                 
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            


            {/* Field Statistics */}
            {showFieldStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistiques Détaillées par Champ
                  </CardTitle>
                  <CardDescription>Analyse des données selon les champs sélectionnés</CardDescription>
                </CardHeader>
                <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {champStats.map((champ, index) => (
                                <div
                                  key={index}
                                  className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <h4 className="font-medium text-gray-900">{champ.field}</h4>
                                  <div className="text-sm space-y-2">
                                    {champ.values.map((val, i) => (
                                      <div
                                        key={i}
                                        className="flex justify-between items-center"
                                      >
                                        <span className="text-gray-700">{val.value}:</span>
                                        <Badge
                                          variant="secondary"
                                          className="bg-gray-100 text-gray-800"
                                        >
                                          {val.count} entries
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
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Visualisation des Formulaires</h1>
            <p className="text-slate-600">Assistant de configuration multi-étapes</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              Étape {currentStep} / 8
            </Badge>
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className="w-full max-w-4xl">
          {/* Step 1: Organization Selection */}
          {currentStep === 1 && (
            <Card className="border-l-4 border-l-blue-500 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  Sélection de l'Organisation
                </CardTitle>
                <CardDescription className="text-base">
                  Choisissez l'organisation pour filtrer les programmes et formulaires disponibles
                </CardDescription>
              </CardHeader>
             <CardContent className="space-y-6">
  <div className="space-y-3">
    <Label htmlFor="organization" className="text-sm font-medium">
      Organisation
    </Label>
    <Select
      value={selectedOrganization !== null ? selectedOrganization.toString() : undefined}
      onValueChange={(value) =>
        setSelectedOrganization(value === "all" ? "all" : Number(value))
      }
    >
      <SelectTrigger className="w-full h-12">
        <SelectValue placeholder="Sélectionner une organisation..." />
      </SelectTrigger>
      <SelectContent>
        {/* ✅ Option "All organizations" ajoutée */}
        <SelectItem value="all" className="py-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span>Toutes les organisations</span>
          </div>
        </SelectItem>

        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id.toString()} className="py-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-slate-500" />
              <span>{org.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {selectedOrganization && selectedOrganization !== "all" && (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-blue-900">Organisation sélectionnée</span>
      </div>
      <p className="text-blue-700 text-sm">
        {organizations.find((o) => o.id === selectedOrganization)?.name}
      </p>
    </div>
  )}
</CardContent>

            </Card>
          )}

          {/* Step 2: Program Selection */}
          {currentStep === 2 && (
            <Card className="border-l-4 border-l-green-500 shadow-lg">
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-3 text-xl">
      <div className="p-2 bg-green-100 rounded-lg">
        <BookOpen className="h-6 w-6 text-green-600" />
      </div>
      Sélection du Programme
    </CardTitle>
    <CardDescription className="text-base">
      Choisissez le programme de recherche à analyser
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">
    <div className="space-y-3">
      <Label htmlFor="program" className="text-sm font-medium">
        Programme
      </Label>
      <Select
       value={selectedProgram}
                onValueChange={setSelectedProgram}
      >
        <SelectTrigger className="w-full h-12">
          <SelectValue placeholder="Sélectionner un programme..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="py-3">
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span>Tous les programmes</span>
            </div>
          </SelectItem>

          {programs.map((program) => (
            <SelectItem
              key={program.id}
              value={program.id.toString()}
              className="py-3"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span>{program.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-4 w-4 text-slate-600" />
          <span className="font-medium text-slate-900">Organisation</span>
        </div>
        <p className="text-slate-700 text-sm">
          {organizations.find((o) => o.id === selectedOrganization)?.name}
        </p>
      </div>

      {selectedProgram && selectedProgram !=="all" &&(
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-900">Programme sélectionné</span>
          </div>
          <p className="text-green-700 text-sm">
          {programs.find((o) => o.id === Number(selectedProgram))?.name}

          </p>
        </div>
      )}
    </div>
  </CardContent>
</Card>

          )}

          {/* Step 3: Form Status */}
          {currentStep === 3 && (
            <Card className="border-l-4 border-l-purple-500 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  Statut des Formulaires
                </CardTitle>
                <CardDescription className="text-base">
                  Filtrez les formulaires selon leur statut de soumission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Statut des formulaires</Label>
                  <Select value={formStatus} onValueChange={setFormStatus}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Sélectionner un statut..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted" className="py-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Formulaires soumis</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="not-submitted" className="py-3">
                        <div className="flex items-center gap-3">
                          <XCircle className="h-4 w-4 text-orange-600" />
                          <span>Formulaires non soumis</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="all" className="py-3">
                        <div className="flex items-center gap-3">
                          <Filter className="h-4 w-4 text-blue-600" />
                          <span>Tous les formulaires</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

               {stats && (
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 bg-green-50 rounded-lg text-center">
      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
      <div className="text-2xl font-bold text-green-900">{stats.submitted}</div>
      <div className="text-sm text-green-700">Soumis</div>
    </div>

    <div className="p-4 bg-orange-50 rounded-lg text-center">
      <XCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
      <div className="text-2xl font-bold text-orange-900">{stats.not_submitted}</div>
      <div className="text-sm text-orange-700">Non soumis</div>
    </div>

    <div className="p-4 bg-blue-50 rounded-lg text-center">
      <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
      <div className="text-2xl font-bold text-blue-900">
        {stats.submitted + stats.not_submitted}
      </div>
      <div className="text-sm text-blue-700">Total</div>
    </div>
  </div>
)}

              </CardContent>
            </Card>
          )}

          {/* Step 4: Form Type */}
          {currentStep === 4 && (
            <Card className="border-l-4 border-l-orange-500 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Layers className="h-6 w-6 text-orange-600" />
                  </div>
                  Type de Formulaire
                </CardTitle>
                <CardDescription className="text-base">Sélectionnez le type de formulaire à analyser</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formType === "application"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setFormType("application")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold text-lg">Formulaire de Candidature</span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      Formulaires soumis par les candidats pour postuler aux projets de recherche
                    </p>
                    {formType === "application" && (
                      <div className="mt-3 flex items-center gap-2 text-blue-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Sélectionné</span>
                      </div>
                    )}
                  </div>

                  <div
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formType === "evaluation"
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setFormType("evaluation")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                      <span className="font-semibold text-lg">Formulaire d'Évaluation</span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      Formulaires d'évaluation remplis par les experts pour noter les projets
                    </p>
                    {formType === "evaluation" && (
                      <div className="mt-3 flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Sélectionné</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Form Selection */}
          {currentStep === 5 && (
            <Card className="border-l-4 border-l-indigo-500 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Target className="h-6 w-6 text-indigo-600" />
                  </div>
                  Sélection du Formulaire
                </CardTitle>
                <CardDescription className="text-base">Choisissez le formulaire spécifique à analyser</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Formulaire disponible</Label>
                  <Select value={selectedForm} onValueChange={setSelectedForm}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Sélectionner un formulaire..." />
                    </SelectTrigger>
                    <SelectContent>
                                      {forms.map((form) => (
                                        <SelectItem key={form.id} value={form.id.toString()}>
                                          <div className="flex flex-col items-start">
                                            <span className="font-medium">{form.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                              {form.description || "No additional info"}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedForm && (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-indigo-600" />
                        <span className="font-medium text-indigo-900">Formulaire sélectionné</span>
                      </div>
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                        {formType === "application" ? "Candidature" : "Évaluation"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-indigo-700 font-medium">Nom:</span>
                        <p className="text-indigo-600">
                          {forms.find((o) => o.id === Number(selectedForm))?.name}
                        </p>
                      </div>
                      
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 6: Application Status */}
          {currentStep === 6 && (
            <Card className="border-l-4 border-l-pink-500 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Users className="h-6 w-6 text-pink-600" />
                  </div>
                  Statut des Candidatures
                </CardTitle>
                <CardDescription className="text-base">
                  Filtrez les candidatures selon leur statut de soumission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      applicationStatus === "submitted"
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setApplicationStatus("submitted")}
                  >
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="font-semibold text-green-900">Candidatures Soumises</div>
                      <div className="text-sm text-green-700 mt-1">Dossiers complets</div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      applicationStatus === "not-submitted"
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setApplicationStatus("not-submitted")}
                  >
                    <div className="text-center">
                      <XCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="font-semibold text-orange-900">Candidatures Non Soumises</div>
                      <div className="text-sm text-orange-700 mt-1">Dossiers en cours</div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      applicationStatus === "all"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setApplicationStatus("all")}
                  >
                    <div className="text-center">
                      <Filter className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-blue-900">Toutes les Candidatures</div>
                      <div className="text-sm text-blue-700 mt-1">Tous les statuts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Field Selection */}
          {currentStep === 7 && (
            <Card className="border-l-4 border-l-teal-500 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Settings className="h-6 w-6 text-teal-600" />
                  </div>
                  Sélection des Champs
                </CardTitle>
                <CardDescription className="text-base">
                  Choisissez les informations à afficher dans les résultats
                </CardDescription>
              </CardHeader>
               <CardContent>
                          <div className="space-y-4">
                            <Label htmlFor="field-select">Fields to Display</Label>
              
                            <select
                              id="field-select"
                              multiple
                              className="w-full border rounded px-3 py-2 h-48"
                              value={checkedFields.map((field) => field.id.toString())}
                              onChange={(e) => {
                                const selectedIds = Array.from(e.target.selectedOptions).map(
                                  (opt) => parseInt(opt.value)
                                );
              
                                const updatedFields = fields.map((field) => ({
                                  ...field,
                                  checked: selectedIds.includes(field.id),
                                }));
              
                                setFields(updatedFields);
                              }}
                            >
                              {fields.map((field) => (
                                <option key={field.id} value={field.id}>
                                  {field.caption}
                                </option>
                              ))}
                            </select>
              
                            {checkedFields.length > 0 && (
                              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <div className="text-sm font-medium text-indigo-900 mb-2">
                                  Selected Fields ({checkedFields.length}):
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {checkedFields.map((field) => (
                                    <Badge
                                      key={field.id}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {field.caption}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
            </Card>
          )}

          {/* Step 8: Display Options */}
          {currentStep === 8 && (
            <Card className="border-l-4 border-l-violet-500 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Eye className="h-6 w-6 text-violet-600" />
                  </div>
                  Options d'Affichage
                </CardTitle>
                <CardDescription className="text-base">
                  Personnalisez l'affichage des résultats selon vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Informations des Candidats
                    </h3>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <Label className="font-medium cursor-pointer">Afficher les fichiers déposés</Label>
                          <p className="text-sm text-slate-600">CV, diplômes, documents</p>
                        </div>
                      </div>
                      <Switch checked={showUploadedFiles} onCheckedChange={setShowUploadedFiles} />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <Label className="font-medium cursor-pointer">Afficher les détails candidat</Label>
                          <p className="text-sm text-slate-600">Avatar, nom, email</p>
                        </div>
                      </div>
                      <Switch checked={showCandidateDetails} onCheckedChange={setShowCandidateDetails} />
                    </div>

                    {formType === "evaluation" && (
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-indigo-600" />
                          <div>
                            <Label className="font-medium cursor-pointer">Informations porteur de projet</Label>
                            <p className="text-sm text-slate-600">Détails du propriétaire du projet évalué</p>
                          </div>
                        </div>
                        <Switch checked={showProjectOwner} onCheckedChange={setShowProjectOwner} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Statistiques
                    </h3>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <div>
                          <Label className="font-medium cursor-pointer">Statistiques globales</Label>
                          <p className="text-sm text-slate-600">Métriques générales</p>
                        </div>
                      </div>
                      <Switch checked={showGlobalStats} onCheckedChange={setShowGlobalStats} />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                        <div>
                          <Label className="font-medium cursor-pointer">Statistiques par champ</Label>
                          <p className="text-sm text-slate-600">Analyse détaillée</p>
                        </div>
                      </div>
                      <Switch checked={showFieldStats} onCheckedChange={setShowFieldStats} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="h-5 w-5 text-violet-600" />
                    <span className="font-medium text-violet-900">Configuration actuelle</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-violet-700 font-medium">Fichiers:</span>
                      <p className="text-violet-600">{showUploadedFiles ? "Affichés" : "Masqués"}</p>
                    </div>
                    <div>
                      <span className="text-violet-700 font-medium">Détails:</span>
                      <p className="text-violet-600">{showCandidateDetails ? "Affichés" : "Masqués"}</p>
                    </div>
                    <div>
                      <span className="text-violet-700 font-medium">Stats globales:</span>
                      <p className="text-violet-600">{showGlobalStats ? "Affichées" : "Masquées"}</p>
                    </div>
                    <div>
                      <span className="text-violet-700 font-medium">Stats champs
                        :</span>
                      <p className="text-violet-600">{showFieldStats ? "Affichées" : "Masquées"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i + 1 === currentStep ? "bg-primary w-8" : i + 1 < currentStep ? "bg-primary" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
         

       {currentStep === 8 ? (
  <Button className="flex items-center gap-2" onClick={handleGenerateResults} disabled={loading}>
    <BarChart3 className="h-4 w-4" />
    {loading ? "Génération..." : "Générer les résultats"}
  </Button>
)  : (
  <Button
    onClick={() => setCurrentStep(Math.min(8, currentStep + 1))}
    disabled={currentStep === 8}
    className="flex items-center gap-2"
  >
    Suivant
    <ChevronRight className="h-4 w-4" />
  </Button>
)}

        </div>
      </div>
    </div>
  )
}
