from flask import current_app
from sqlalchemy import Column, ForeignKey, func
from sqlalchemy import String, Unicode, DateTime, Boolean
from sqlalchemy import SmallInteger, Integer, Float
from sqlalchemy.orm import relationship

from app.models.base import db, Base


class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    openid = Column(String(60), unique=True)

    def __init__(self, openid):
        self.openid = openid