# might want to not use alpine here
FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build

EXPOSE 5000
CMD ["npm", "run", "start"]
