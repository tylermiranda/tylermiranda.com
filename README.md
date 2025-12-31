# tylermiranda.com

A simple static site repository containing the source for tylermiranda.com.

Contents
- `index.html` — main HTML page
- `content.md` — optional content source
- `style.css` — site styles
- `script.js` — client JavaScript
- `nginx.conf` — example Nginx configuration
- `Dockerfile` — Docker image for serving the site
- `docker-compose.yml` — compose file to run the site and related services
- `attached_assets/` — images and other assets

Quickstart

Prerequisites
- Docker and Docker Compose installed

Run with Docker Compose

1. Build and start containers:

```bash
docker compose up --build -d
```

2. Open a browser to http://localhost (or the port configured in `docker-compose.yml`).

Run locally without Docker

1. Serve the directory with a simple HTTP server (Python example):

```bash
cd /path/to/repo
python3 -m http.server 8000
```

2. Open http://localhost:8000

Notes
- `nginx.conf` is provided as an example for deploying behind Nginx.
- Adjust ports and environment values in `docker-compose.yml` before production use.

License
- No license specified. Add a `LICENSE` file if you wish to set a license.

Contact
- For questions, update files, or changes, edit the repo or contact the owner.
