from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from app.models.user import User
from app.models.organization import Organization
from app.models.organization_user import organization_user_table
from app.api import assign_organization, login, add_manager,get_manager,update_manager ,managers, get_organizations_by_manager,get_recruitment_form,get_fields_by_form_id,get_recuitment_form_data,get_application_stats,organization_route,get_program,get_forms,get_users,get_inscription_forms_status_is_submitted,get_invitations,get_program_form_stats,verify_otp,resend_otp

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "hello world"}

# ✅ Crée toutes les tables déclarées dans Base
Base.metadata.create_all(bind=engine)

# ✅ Autoriser les requêtes venant du front (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router)
app.include_router(add_manager.router)
app.include_router(get_manager.router)
app.include_router(update_manager.router)
app.include_router(managers.router)
app.include_router(get_organizations_by_manager.router)
app.include_router(assign_organization.router)
app.include_router(get_recruitment_form.router)
app.include_router(get_fields_by_form_id.router)
app.include_router(get_recuitment_form_data.router)
app.include_router(get_application_stats.router)
app.include_router(organization_route.router)
app.include_router(get_program.router)
app.include_router(get_forms.router)
app.include_router(get_users.router)
app.include_router(get_inscription_forms_status_is_submitted.router)
app.include_router(get_invitations.router)
app.include_router(get_program_form_stats.router)
app.include_router(verify_otp.router)
app.include_router(resend_otp.router)