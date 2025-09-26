"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
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


import {
  FileText,
  Download,
  Users,
  Mail,
  GraduationCap,
  BarChart3,
  Building2,
  BookOpen,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Filter,
} from "lucide-react";



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
export function FormsVisualization() {
  // Step states
  const [selectedOrganization, setSelectedOrganization] = React.useState<string | number | null>(null);

  const [forms, setForms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = React.useState("");
  const [formStatus, setFormStatus] = React.useState("");
  const [formType, setFormType] = React.useState("");
  const [selectedForm, setSelectedForm] = React.useState("");
  const [candidatureType, setCandidatureType] = React.useState("");
  const [candidatureData, setCandidatureData] = useState<any[]>([]);

  // Display options
  const [showUploadedFiles, setShowUploadedFiles] = React.useState(true);
  const [showCandidateDetails, setShowCandidateDetails] = React.useState(true);
  const [showGlobalStats, setShowGlobalStats] = React.useState(true);
  const [showFieldStats, setShowFieldStats] = React.useState(false);
  const [showProjectOwner, setShowProjectOwner] = React.useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [showFiles, setShowFiles] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"table" | "cards">("table");
  const [showResults, setShowResults] = useState(false);
  const [champStats, setChampStats] = useState<ChampStat[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);

  // Reset dependent selections when parent changes
  React.useEffect(() => {
    setSelectedProgram("");
    setFormStatus("");
    setFormType("");
    setSelectedForm("");
    setCandidatureType("");
  }, [selectedOrganization]);

  React.useEffect(() => {
    setFormStatus("");
    setFormType("");
    setSelectedForm("");
    setCandidatureType("");
  }, [selectedProgram]);

  const handleFieldChange = (fieldId: number, checked: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, checked } : field
      )
    );
  };
 const checkedFields = fields.filter((field) => field.checked);
 
    const canProceed = {
    1: !!selectedOrganization,
    2: !!selectedProgram,
    3: !!formStatus,
    4: !!formType,
    5: !!selectedForm,
    6: !!candidatureType,
    7: checkedFields.length > 0,
  };

  



  const ShowResults =
    selectedOrganization &&
    selectedProgram &&
    formStatus &&
    formType &&
    selectedForm &&
    candidatureType &&
    checkedFields.length > 0;

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


useEffect(() => {
  const fetchData = async () => {
    if (selectedForm && checkedFields.length > 0 && candidatureType) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token non trouvé");
        return;
      }

      const formId = Number(selectedForm);
      const fieldIds = checkedFields.map((f) => f.id);
      const data = await getFormDataClient(formId, fieldIds, candidatureType, formType, token);

      const results = data.results;
      setCandidatureData(results);
      setShowResults(true);

      // Construire les stats par champ
      const stats: ChampStat[] = checkedFields.map((field) => {
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
}, [selectedForm, checkedFields, candidatureType, formType]);


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
      setStats(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des statistiques.");
      console.error(err);
    }
  };

  fetchStats();
}, [selectedForm]);



return (
    <div className="space-y-6">
      {/* Step 1: Organization Selection */}

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Building2 className="h-5 w-5" />
            Étape 1: Sélection de l'organisation
          </CardTitle>
          <CardDescription>
            Sélectionnez l'organisation pour filtrer les programmes et les formulaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="organization">Organisation</Label>
            <Select
  value={selectedOrganization !== null ? selectedOrganization.toString() : undefined}
  onValueChange={(value) =>
    setSelectedOrganization(value === "all" ? "all" : Number(value))
  }
>

              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select organization..." />
              </SelectTrigger>
              <SelectContent>
                {/* ✅ Ajout de l’option "All organizations" */}
                <SelectItem value="all">Toutes les organisations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.name} — {org.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Program Selection */}
      {selectedOrganization && (
        <Card className="border-l-4 border-l-blue-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Étape 2: Sélection du programme
            </CardTitle>

            {selectedOrganization !== "all" && (
              <CardDescription>
                Programmes disponibles pour :{" "}
                <Badge variant="outline">
                  {
                    organizations.find(
                      (o) => o.id === Number(selectedOrganization)
                    )?.name
                  }
                </Badge>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="program">Programme</Label>
              <Select
                value={selectedProgram}
                onValueChange={setSelectedProgram}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select program..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">tous les programmes</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Form Status */}
      {selectedProgram && (
        <Card className="border-l-4 border-l-green-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Étape 3: Status du formulaire
            </CardTitle>
            <CardDescription>
              Filtrer les formulaires en fonction de leur statut de soumission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="form-status">Status du formulaire</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select form status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Submitted
                    </div>
                  </SelectItem>
                  <SelectItem value="not-submitted">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-orange-600" />
                      Not Submitted
                    </div>
                  </SelectItem>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-blue-600" />
                      All
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Form Type */}
      {formStatus && (
        <Card className="border-l-4 border-l-purple-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Étape 4: Type de formulaire
            </CardTitle>
            <CardDescription>
              Choisissez le type de formulaire à analyser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="form-type">Type de formulaire</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select form type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Formulaire de candidature
                    </div>
                  </SelectItem>
                  <SelectItem value="evaluation">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      Formulaire d'évaluation
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Form Selection */}
      {formType && forms.length > 0 && (
        <Card className="border-l-4 border-l-orange-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-600" />
              Étape 5: Sélection de formulaire
            </CardTitle>
            <CardDescription>
              Sélectionnez un formulaire spécifique• Type:{" "}
              <Badge variant="outline">
                {formType === "application"
                  ? "Application Form"
                  : "Evaluation Form"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="form">Formulaire</Label>
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select form..." />
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
          </CardContent>
        </Card>
      )}

      {/* Step 6: Application Status */}
      {selectedForm && (
        <Card className="border-l-4 border-l-pink-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-600" />
              Étape 6: Statut de candidature
            </CardTitle>
            <CardDescription>
              Filtrer les candidatures en fonction de leur statut de soumission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="application-status">Statut de candidature</Label>
              <Select
                value={candidatureType}
                onValueChange={setCandidatureType}
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select application status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      soumise
                    </div>
                  </SelectItem>
                  <SelectItem value="not-submitted">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-orange-600" />
                      non soumises
                    </div>
                  </SelectItem>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-blue-600" />
                      toutes les candidatures
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 7: Field Selection */}
      {candidatureType && (
        <Card className="border-l-4 border-l-indigo-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              Étape 7:Sélection des champs
            </CardTitle>
            <CardDescription>
              Choisissez les champs à afficher dans le tableau des résultats
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="field-select">Les champs à afficher </Label>

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
                    Champs sélectionés  ({checkedFields.length}):
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
      {ShowResults && (
        <Card className="border-l-4 border-l-teal-500 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-600" />
              Étape 8: Options d'affichage
            </CardTitle>
            <CardDescription>
              Personnaliser l'affichage des résultats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-teal-50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <Label
                    htmlFor="show-files"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Afficher les fichiers téléchargés
                  </Label>
                </div>
                <Switch
                  id="show-files"
                  checked={showUploadedFiles}
                  onCheckedChange={setShowUploadedFiles}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-teal-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <Label
                    htmlFor="show-candidate-details"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Afficher les détails du candidat
                  </Label>
                </div>
                <Switch
                  id="show-candidate-details"
                  checked={showCandidateDetails}
                  onCheckedChange={setShowCandidateDetails}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-teal-50 transition-colors">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <Label
                    htmlFor="show-global-stats"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Afficher les statistiques globales
                  </Label>
                </div>
                <Switch
                  id="show-global-stats"
                  checked={showGlobalStats}
                  onCheckedChange={setShowGlobalStats}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-teal-50 transition-colors">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                  <Label
                    htmlFor="show-field-stats"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Afficher les statistiques par champ
                  </Label>
                </div>
                <Switch
                  id="show-field-stats"
                  checked={showFieldStats}
                  onCheckedChange={setShowFieldStats}
                />
              </div>

              {formType === "evaluation" && (
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-teal-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                    <Label
                      htmlFor="show-project-owner"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Afficher les informations du propriétaire du projet
                    </Label>
                  </div>
                  <Switch
                    id="show-project-owner"
                    checked={showProjectOwner}
                    onCheckedChange={setShowProjectOwner}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applied Filters Summary */}
      {ShowResults && (
        <Card className="bg-muted/50 animate-in slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Les filtres appliqués
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                Organization:{" "}
                {organizations.find((o) => o.id === selectedOrganization)?.name}
              </Badge>
              <Badge variant="outline">
                Program:{" "}
                {programs.find((p) => p.id === Number(selectedProgram))?.name}
              </Badge>

              <Badge variant="outline">Statust de formulaire: {formStatus}</Badge>
              <Badge variant="outline">
                Form Type:{" "}
                {formType === "application" ? "Application" : "Evaluation"}
              </Badge>
              <Badge variant="outline">
                Statut de candidature: {candidatureType}
              </Badge>
              <Badge variant="outline">
                {checkedFields.length} les champs sélectionnés
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Statistics */}
      {showResults && showGlobalStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-in slide-in-from-top-5 duration-500">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de candidats
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground">candidats trouvés</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Candidatures soumises
              </CardTitle>
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
                {Math.round((stats.not_submitted / stats.total) * 100)}% du
                total
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avec documents
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.with_documents}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.with_documents / stats.total) * 100)}% du
                total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Table */}

      {/* Résultats */}
      {ShowResults && (
        <Card className="animate-in slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Résultats                </CardTitle>
                <CardDescription>
                  {candidatureData.length} candidat(s) trouvé(s) •{" "}
                  {candidatureType}
                </CardDescription>
              </div>
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
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {showCandidateDetails && (
                      <TableHead className="w-[250px]">Candidat</TableHead>
                    )}
                    {checkedFields.map((field) => (
                      <TableHead key={field.id}>{field.caption}</TableHead>
                    ))}
                    <TableHead>Statut</TableHead>
                    {showUploadedFiles && <TableHead>Documents</TableHead>}
                    {formType === "evaluation" && showProjectOwner && <TableHead>Porteur de Projet</TableHead>}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {candidatureData.map((candidature) => (
                    <TableRow
                      key={candidature.id}
                      className="hover:bg-muted/50"
                    >
                      {showCandidateDetails && (
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage alt={candidature.name} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {candidature.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {candidature.name}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {candidature.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {checkedFields.map((field) => (
                        <TableCell
                          key={field.id}
                          className="max-w-[200px] truncate"
                        >
                          {candidature[field.id as keyof typeof candidature] ||
                            "-"}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Badge
                          variant={
                            candidature.candidature_status === "Soumise"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {candidature.candidature_status}
                        </Badge>
                      </TableCell>
                      {showUploadedFiles && (
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {candidature.files &&
                            candidature.files.length > 0 ? (
                              candidature.files.map((file: any) => (
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
                              <span className="text-muted-foreground text-sm">
                                Aucun fichier
                              </span>
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
                {candidatureData.map((candidature) => (
                  <Card
                    key={candidature.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={candidature.avatar || "/placeholder.svg"}
                            alt={candidature.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {candidature.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{candidature.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {candidature.email}
                          </p>
                        </div>
                        <Badge
                          variant={
                            candidature.candidature_status === "Soumise"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {candidature.candidature_status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {checkedFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {field.caption}:
                          </span>
                          <span className="font-medium truncate ml-2">
                            {candidature[
                              field.id as keyof typeof candidature
                            ] || "-"}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Field Statistics */}
      {ShowResults && showFieldStats && (
        <Card className="animate-in slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistiques par Champ
            </CardTitle>
            <CardDescription>
              Analyse détaillée des champs sélectionnés
            </CardDescription>
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
                          {val.count} entrées
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
  );
}
