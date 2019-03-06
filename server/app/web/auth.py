import json

from flask import Blueprint, request, jsonify, current_app, make_response
from functools import wraps
import requests
import time
import base64
import hmac
import jwt

from app.libs.token import generate_token, certify_token
from app.models.base import db
from app.models.user import User

auth = Blueprint('web', __name__)

def authorize(fn):
    @wraps(fn)
    def wrapper(*args, **kwgs):
        token = request.headers.get("Authorization")
        if token is not None :
            payload = certify_token(token)
            if payload:
                kwgs['openid'] = payload['openid']
                return fn(*args, **kwgs)
            else:
                return make_response(jsonify({'error': '無效的token'})), 401
        else:
            return make_response(jsonify({'error': '未授权'})), 401
    return wrapper


@auth.route('/login', methods=['POST'])
def login():
    code = request.json['code']
    if code:
        url = "{}?appid={}&secret={}&js_code={}".format(
            current_app.config['CODE_SESSION_URL'],
            current_app.config['APPID'],
            current_app.config['APP_SECRET'],
            request.json['code'])
        res = requests.get(url).json()
        if not User.query.filter_by(openid=res['openid']).first():
            user = User(res['openid'])
            db.session.add(user)
            db.session.commit()
    payload = {
        "openid": res["openid"],
        "exp": int(time.time()) + 86400 * 7,
    }
    token = str(generate_token(payload), encoding='ascii')
    print("得到token", token)
    return json.dumps({"token": token})


@auth.route('/wxcode')
def getWxcode():
    access_token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={}&secret={}".format(
        current_app.config["APPID"], current_app.config["APP_SECRET"]
    )
    res = requests.get(access_token_url).json()
    wxcode_url = "https://api.weixin.qq.com/wxa/getwxacode?access_token={}".format(res["access_token"])
    data = json.dumps({
        "path": "pages/index/index",
        "width": "100"
    })
    wxcode = requests.post(wxcode_url, data=data).content
    repr = make_response(wxcode, 200)
    repr.headers["content-type"] = "image/jpeg"
    return repr
