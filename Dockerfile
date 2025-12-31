FROM nginx:alpine

# Copy website files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY content.md /usr/share/nginx/html/
COPY favicon.ico /usr/share/nginx/html/
COPY attached_assets/ /usr/share/nginx/html/attached_assets/

# Copy custom nginx config to serve on port 1337
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1337

CMD ["nginx", "-g", "daemon off;"]
