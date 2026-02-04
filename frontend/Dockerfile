# Se utiliza Node.js en su versión LTS (estable) sobre una imagen ligera basada en Linux
FROM node:20-slim

# Se establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Se copian únicamente los archivos de dependencias para aprovechar la caché de Docker
COPY package.json package-lock.json* ./

# Se instalan las dependencias forzando la plataforma Linux y la arquitectura ARM64,
# omitiendo posibles conflictos con archivos lock generados en macOS
RUN npm install --include=optional --platform=linux --arch=arm64 --force

# Se copia el resto del código de la aplicación al contenedor
COPY . .

# Se expone el puerto en el que se ejecutará la aplicación
EXPOSE 5173

# Se define el comando que inicia el servidor de desarrollo
CMD ["npm", "run", "dev"]
