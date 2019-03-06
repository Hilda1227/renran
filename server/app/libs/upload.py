import uuid

from flask import current_app
from qiniu import Auth, put_file, etag, put_data


def upload(file):
    q = Auth(current_app.config['ACCESSKEY'], current_app.config['SECRETKEY'])
    ext = file.filename.rsplit('.', 1)[1].strip().lower()
    key = str(uuid.uuid1().hex).replace('-', '') + '.' + ext

    # 上传文件到七牛后， 七牛将文件名和文件大小回调给业务服务器。
    policy = {
        'callbackUrl': 'http://your.domain.com/callback.php',
        'callbackBody': 'filename=$(fname)&filesize=$(fsize)'
    }

    expires = 3600 * 24 * 365 * 10
    token = q.upload_token(current_app.config['BUCKET'], key, expires, policy)

    ret, info = put_data(token, key, file.read())
    if ret is None:
        return current_app.config['QINIU_PATH'] + key
    return None
