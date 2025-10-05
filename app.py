# app.py - Simple Flask proxy for Render/Gunicorn
from flask import Flask, request, Response, send_from_directory
import requests, os
from urllib.parse import urlparse

app = Flask(__name__, static_folder='public', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/proxy')
def proxy():
    url = request.args.get('url', '').strip()
    if not url:
        return "Missing url parameter", 400

    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return "Invalid URL", 400

    # optional whitelist (empty = allow all public domains)
    WHITELIST = []

    if WHITELIST:
        host = parsed.netloc.lower()
        ok = False
        for d in WHITELIST:
            if host == d or host.endswith('.' + d):
                ok = True; break
        if not ok:
            return "Domain not allowed", 403

    try:
        r = requests.get(url, timeout=15, headers={}, stream=True)
    except requests.exceptions.RequestException as e:
        return "Upstream request error: %s" % e, 502

    MAX_BYTES = 3 * 1024 * 1024
    content = r.raw.read(MAX_BYTES + 1)
    if len(content) > MAX_BYTES:
        return "Upstream response too large", 413

    resp = Response(content, status=r.status_code)
    if 'Content-Type' in r.headers:
        resp.headers['Content-Type'] = r.headers['Content-Type']
    else:
        resp.headers['Content-Type'] = 'application/octet-stream'

    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With'
    resp.headers['X-Proxy-By'] = 'tachi-python-proxy'
    return resp

@app.route('/healthz')
def health():
    return 'ok', 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '10000'))
    app.run(host='0.0.0.0', port=port)
