# Ejecutar el proyecto en Docker

Instrucciones rápidas en español para construir y correr la aplicación React (Vite) con Docker.

1) Build producción y correr con nginx

```bash
# construir imagen
docker build -t hospital-frontend:prod .

# ejecutar contenedor (mapea puerto 80)
docker run --rm -p 80:80 hospital-frontend:prod
```

2) Usar docker-compose (producción)

```bash
docker-compose up --build web
```

3) Modo desarrollo con docker-compose (hot-reload)

```bash
docker-compose up dev
# luego abrir http://localhost:5173
```

Notas:
- El servicio `dev` ejecuta `npm run dev -- --host 0.0.0.0` para exponer Vite fuera del contenedor.
- Si tienes un backend, ajusta la sección `location /api/` en `.nginx/nginx.conf` o añade otro servicio en `docker-compose.yml`.
- Asegúrate de tener Docker Desktop corriendo en Windows antes de ejecutar los comandos.
