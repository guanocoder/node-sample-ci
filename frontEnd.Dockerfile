# might want to not use alpine here
FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install --production

EXPOSE 3000 5000

CMD ["npm", "run", "dev"]
