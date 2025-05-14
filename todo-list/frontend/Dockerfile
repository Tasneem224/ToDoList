FROM nginx:alpine

# نسخ الملفات الثابتة
COPY . /usr/share/nginx/html

# نسخ إعدادات nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

#eman
# # Use Nginx as base image
# FROM nginx:alpine

# # Copy frontend files to Nginx
# COPY . /usr/share/nginx/html

# # Expose port
# EXPOSE 80