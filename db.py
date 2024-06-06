from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Создание соединения с базой данных
engine = create_engine('sqlite:///user_documents.db', echo=True)

Base = declarative_base()

# Определение класса для пользователей
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)

    # Определение отношения один-ко-многим с документами
    documents = relationship("Document", back_populates="user")

# Определение класса для документов
class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String)
    middle_name = Column(String)
    stud_num = Column(String)
    country = Column(String)
    speciality = Column(String)
    learn_base = Column(String)
    form_type = Column(String)
    reason = Column(String)
    date = Column(String)

    user = relationship("User", back_populates="documents")

# Создание таблиц в базе данных
Base.metadata.create_all(engine)

# Создание сессии
Session = sessionmaker(bind=engine)
session = Session()


# Вывод всех пользователей и их документов
users = session.query(User).all()
for user in users:
    print("ID:", user.id)
    print("Имя:", user.first_name)
    print("Фамилия:", user.last_name)
    for document in user.documents:
        print("Документ ID:", document.id)
        print("Имя:", document.name)
        print("Отчество:", document.middle_name)
        print("Номер студенческого:", document.stud_num)
        print("Гражданство:", document.country)
        print("Специальность:", document.speciality)
        print("Основа обучения:", document.learn_base)
        print("Форма обучения:", document.form_type)
        print("Причина:", document.reason)
        print("Дата:", document.date)
    print("-----------------")
