from datetime import datetime

from flask import current_app
from sqlalchemy import Column, ForeignKey, func, Date
from sqlalchemy import String, Unicode, DateTime, Boolean
from sqlalchemy import SmallInteger, Integer, Float
from sqlalchemy.orm import relationship

from app.models.base import db, Base


class Record(Base):
    __tablename__ = 'Record'

    id = Column(Integer, primary_key=True)
    openid = Column(String(50), nullable=False)
    name = Column(String(20), nullable=False)
    img_src = Column(String(300), nullable=False)
    date = Column(DateTime, nullable=False)
    is_once = Column(Boolean, default=False)

