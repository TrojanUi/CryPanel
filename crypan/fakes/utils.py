from base64 import b64decode
import hashlib
import hmac
import struct
import time
import requests
from .views import Log

def guardCode(id, userid):
    log = Log.query.filter_by(id=id, worker=userid).first()
    if log.mafile is not None:
        secret = Log.mafile['secret']
        t = int(time.time() / 30)
        msg = struct.pack(">Q", t)
        key = b64decode(secret)
        mac = hmac.new(key, msg, hashlib.sha1).digest()
        offset = mac[-1] & 0x0f
        binary = struct.unpack('>L', mac[offset:offset + 4])[0] & 0x7fffffff
        codestr = list('23456789BCDFGHJKMNPQRTVWXY')
        chars = []
        for _ in range(5):
            chars.append(codestr[binary % 26])
            binary //= 26
        code = ''.join(chars)
        return code
    else:
        return None