from flask import Flask
from app.models.base import db


def create_app():
    app = Flask(__name__);

    # 配置文件
    app.config.from_object("app.config.secure")
    app.config.from_object("app.config.setting")

    # 注册蓝图
    from app.web.auth import auth
    from app.web.record import record
    app.register_blueprint(auth)
    app.register_blueprint(record)

    db.init_app(app)
    db.create_all(app=app)  # 在数据库生成数据表
    return app;