
from datetime import datetime


class RecordViewModel:
    def __init__(self, data):
        self.data = data

    @property
    def days(self):
        return (datetime.today() - self.data.date).days

    def get_data(self):
        ret = {
            "name": self.data.name,
            "date": str(self.data.date),
            "img_src": self.data.img_src,
            "is_once": self.data.is_once,
            "days": self.days,
            "id": self.data.id
        }
        return ret


class RecordCollection:
    def __init__(self):
        self.total = 0
        self.records = []

    def fill(self, records, total):
        self.total = total
        self.records = [RecordViewModel(record).get_data() for record in records]
