from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from docxtpl import DocxTemplate
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db import User, Document

app = FastAPI()

# Настройка CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def docCreate(template_name, data):
    context = data
    doc = DocxTemplate(template_name)
    doc.render(context)
    doc.save("generated.docx")




@app.post("/submit_form/")
async def submit_form(
        name: str = Form(...),
        last_name: str = Form(...),
        middle_name: str = Form(...),
        stud_num: str = Form(...),
        country: str = Form(...),
        speciality: str = Form(...),
        learn_base: str = Form(...),
        form_type: str = Form(...),
        reason: str = Form(...),
        date: str = Form(...)
):
    engine = create_engine('sqlite:///user_documents.db', echo=True)
    Session = sessionmaker(bind=engine)

    with Session() as session:
        user = session.query(User).filter_by(first_name=name, last_name=last_name).first()
        if not user:
            user = User(first_name=name, last_name=last_name)
            session.add(user)
            session.commit()

        document = Document(
            user=user,
            name=name,
            middle_name=middle_name,
            stud_num=stud_num,
            country=country,
            speciality=speciality,
            learn_base=learn_base,
            form_type=form_type,
            reason=reason,
            date=date
        )
        session.add(document)
        session.commit()

        data = {
            "name": name,
            "last_name": last_name,
            "middle_name": middle_name,
            "stud_num": stud_num,
            "country": country,
            "speciality": speciality,
            "learn_base": learn_base,
            "form_type": form_type,
            "reason": reason,
            "date": date
        }

        docCreate("template1.docx", data)

    return {"filename": "generated.docx"}


@app.get("/download/{filename}", response_class=FileResponse)
async def download_file(filename: str):
    file_path = f"./{filename}"
    return FileResponse(path=file_path, filename=filename,
                        media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
