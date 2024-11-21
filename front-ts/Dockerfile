# Utilizamos la imagen oficial de Node.js 21 como base
FROM node:21

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos el archivo package.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Compilo typescript
RUN npm run build

# Copiamos el código de la aplicación
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Establecemos el comando para ejecutar la aplicación
CMD ["npm", "start"]