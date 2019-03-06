import json

from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import desc

from app.libs.upload import upload
from app.models.base import db
from app.models.record import Record
from app.view_models.record import RecordCollection, RecordViewModel
from app.web.auth import authorize

record = Blueprint('record', __name__)


@record.route('/create', methods=['POST'])
@authorize
def create(*args, **kwgs):
    record = Record()
    record.set_attrs(request.json)
    record.openid = kwgs['openid']
    db.session.add(record)
    db.session.commit()
    return jsonify({'id': record.id})


@record.route('/delete', methods=['DELETE'])
@authorize
def delete(*args, **kwgs):
    record = db.session.query(Record).filter_by(id=request.json['id'], openid=kwgs["openid"]).first()
    if record is None:
        return jsonify({'error': "该数据已被删除"})
    db.session.delete(record)
    db.session.commit()
    return jsonify({'isOk': True})


@record.route('/modify', methods=['POST'])
@authorize
def modify(*args, **kwgs):
    r = db.session.query(Record).filter_by(id=request.json['id'], openid=kwgs["openid"]).first()
    if r is None:
        return jsonify({'error': "此记录不存在"})
    else:
        r.name = request.json['name']
        r.img_src = request.json['img_src']
        r.date = request.json['date']
        r.is_once = request.json['is_once']
        db.session.commit()
        return jsonify({'isOk': True, 'id': request.json['id']})


@record.route('/get_records', methods=['GET'])
@authorize
def getRecords(*args, **kwgs):
    page = request.args.get('page', None)
    if page:
        limit = int(page) * current_app.config['PAGE_COUNT']
    else:
        limit = None
    r = Record.query.filter_by(openid=kwgs['openid']).order_by(desc(Record.create_time)).limit(limit).all()
    count = len(Record.query.filter_by(openid=kwgs['openid']).all())
    records = RecordCollection()
    records.fill(r, count)
    return json.dumps(records, default=lambda obj: obj.__dict__)


@record.route('/get_record', methods=['GET'])
@authorize
def getRecord(*args, **kwgs):
    openid = kwgs['openid']
    id = request.args['id']
    r = Record.query.filter_by(openid=openid, id=id).first()
    if r is not None:
        record = RecordViewModel(r)
        result = record.get_data()
        return json.dumps(result)
    else:
        return json.dumps({'error': "不存在此条记录"})


@record.route('/upload', methods=['POST'])
def uploadImg():
    file = request.files.get('file', None)
    if file is None:
        return jsonify({'error': '未选择图片'})
    else:
        img_src = upload(file)
        if img_src is not None:
            return jsonify({'img_src': img_src})
        else:
            return jsonify({'error': '图片上传失败'})
