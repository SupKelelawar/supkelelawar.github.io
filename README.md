Python Flask proxy + static frontend (ready for Render or similar)

How to deploy:
1. Push this repo to GitHub.
2. Create a new Web Service on Render and connect this repo.
3. Use Python environment. Start command (Render): `gunicorn app:app --bind 0.0.0.0:$PORT --workers 4`

Endpoints:
- GET /proxy?url=<encoded-url>    -> returns proxied content (with CORS headers)
- GET /                          -> serves public/index.html (simple scrape test)
- GET /healthz                   -> healthcheck

Notes:
- This proxy has basic SSRF protections and response size limit (3 MB).
- Edit WHITELIST in app.py to restrict allowed domains for safety.
- Consider adding rate limiting, authentication, caching for production use.
