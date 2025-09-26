from sqlalchemy.orm import Session
from typing import List, Optional, Union
from app.models.form import Form
from app.models.program import Program

def get_forms_by_type_and_status(
    db: Session,
    form_type: int,
    form_status: Optional[int],
    selected_organization: Union[str, int]
) -> List[Form]:
    query = db.query(Form).filter(Form.type == form_type)

    if form_status is not None:
        query = query.filter(Form.status == form_status)

    if selected_organization != "all":
        query = query.join(Program, Form.program_id == Program.id).filter(
            Program.organization_id == int(selected_organization)
        )

    return query.all()
