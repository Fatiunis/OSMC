# Usa una imagen oficial de PHP con Apache
FROM php:8.2-apache

# Copia todos los archivos del proyecto al contenedor
COPY . /var/www/html/

# Habilita el módulo de reescritura de Apache
RUN a2enmod rewrite

# Da permisos y establece el directorio de trabajo
WORKDIR /var/www/html/

# (Opcional) Instala extensiones necesarias de PHP si usas MySQL, por ejemplo:
RUN docker-php-ext-install mysqli

# Expone el puerto 80
EXPOSE 80
