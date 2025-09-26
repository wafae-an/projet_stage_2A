# Plateforme de visualisation des processus des projets de recherche (Dashboard PGAP)

> **But** : Offrir un tableau de bord sécurisé pour **consulter** et **analyser** les données des formulaires PGAP (candidatures, évaluations, inscriptions des experts) sans modifier la base de données source.

## ✨ Points clés
- Interface moderne (Next.js) + API sécurisée (FastAPI).
- Authentification avec OTP (**2FA**) et sessions sécurisées.
- **Rôle Admin** et **Rôle Manager** clairement séparés.
- Recherche multi‑critères, vues détaillées, **export CSV**, statistiques **globales** et **par champ**.
- Documentation API interactive (Swagger / ReDoc).

---

## 👥 Rôles et permissions

### Admin
- **Gère les comptes des managers** (création, activation/désactivation).
- **Affecte des organisations** aux managers (un manager ne voit que ses organisations).
- **Consulte les informations des utilisateurs PGAP** (lecture seule, pour supervision).
> L’Admin ne consulte pas les candidatures au niveau métier ; son rôle est surtout **gouvernance & accès**.

### Manager (fonctionnalité principale)
- **Consulte les candidatures d’un formulaire spécifique** :
  - Types supportés : **candidature**, **évaluation**, **inscription des experts**.
  - Filtres : organisation, programme, statut, etc.
- **Voit les statistiques** :
  - **Globales** (totaux, répartitions).
  - **Par champ** de formulaire (compte des valeurs uniques).
- **Exporte** les résultats **au format CSV**.
- **Consulte les invitations envoyées aux experts** (statut d’inscription au PGAP).

> ⚠️ **Fonctionnalité cœur** : la **consultation des candidatures d’un formulaire donné** avec filtres + stats + export.

---

## 🏗️ Architecture
```
FRONTEND (Next.js)  --->  BACKEND (FastAPI)  --->  DATABASE (MySQL PGAP)
       Port 3000                Port 8000                  Port 3306
                        
```

- **Frontend** : Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui.
- **Backend** : FastAPI, Pydantic, SQLAlchemy, JWT, Redis (OTP).
- **Base PGAP** : source de vérité (lecture seule par l’API).

---

## 📸 Démo — Détails des formulaires

> Démonstration – Fonctionnalité principale (Manager)

![Demo](docs/DEMO.mp4)
```
---

## ⚙️ Installation & exécution

### 1) Cloner
```bash
git clone https://github.com/wafae-an/projet_stage.git
cd dashboard-pgap
```

### 2) Backend (FastAPI)
```bash
cd projet_fastAPI
python -m venv .venv
# Linux/Mac
source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
📌 API : http://localhost:8000 — Docs : http://localhost:8000/docs

### 3) Frontend (Next.js)
```bash
cd projet_next_js
npm install --legacy-peer-deps
npm run dev
```
📌 UI : http://localhost:3000

---

## 🔍 Fonctionnalités en détail

- **Recherche & Filtres** : sélection de formulaire + filtres (organisation, programme, statut…).  
- **Tableau des résultats** : liste des candidatures avec colonnes configurées.  
- **Détails par candidature** : informations pertinentes et pièces jointes (si existantes).  
- **Statistiques** : cartes **globales** (totaux, %), et **par champ** (valeur → occurrences).  
- **Export CSV** : téléchargement des résultats filtrés (UTF‑8, séparateur “,”).  
- **Invitations experts** : suivi des invitations envoyées et état d’inscription.  
- **Sécurité** : OTP/2FA via e‑mail (Redis), JWT, CORS configuré.  

---

## 🧭 Structure (simplifiée)

### Backend
```
backend/
├── app/
│   ├── api/            # Routes FastAPI
│   ├── models/         # SQLAlchemy
│   ├── schemas/        # Pydantic
│   └── services/       # Logique métier
├── main.py
├── database.py
├── security.py         # JWT, 2FA/OTP
├── redis_client.py
├── requirements.txt
└── .env.example
```

### Frontend
```
frontend/
├── app/                # Pages / routes Next.js
├── actions/            # Appels vers l’API (fetch)
├── components/         # UI 
├── lib/                # Utils
├── public/
├── styles/
├── package.json
└── .env.local.example
```

---

## 👤 Auteur
**Wafae Ananouch** — ENSIAS — Génie logiciel  
