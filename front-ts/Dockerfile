# Utilizamos la imagen oficial de Node.js 21 como base
FROM node:21-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos el archivo package.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install


# Copiamos el código de la aplicación
COPY . .

# esto es para pruebas, borrar en prod

RUN grep "(enforceHttps" ./node_modules/oauth4webapi/build/index.js
RUN sed -i 's/(enforceHttps/(false/g' ./node_modules/oauth4webapi/build/index.js


# Compilo typescript
RUN npm run build

# Exponemos el puerto 3000
EXPOSE 80

# Establecemos el comando para ejecutar la aplicación
CMD ["npm", "start"]
