import base64

import jwt
from flask import current_app


def generate_token(payload):
    return jwt.encode(payload, current_app.config["KEY"], algorithm='HS256')


def certify_token(token):
    try:
        payload = jwt.decode(str(token), current_app.config["KEY"], algorithms=['HS256'])
        if payload:
            return payload
        else:
            return False
    except jwt.InvalidTokenError:
        print("token解碼失敗")
        return False
