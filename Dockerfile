FROM docker:latest

# Instale Docker Compose
RUN apk add --no-cache docker-compose

# Copie seu docker-compose.yml e outros arquivos necessários
COPY . /app
WORKDIR /app
COPY init-db.sql /docker-entrypoint-initdb.d/init-db.sql

# Inicie o Docker Compose quando o container for executado
CMD ["docker-compose", "up", "--build"]


#  docker build -t geandersonlemonte/solidarize-docker .

# docker run -v /var/run/docker.sock:/var/run/docker.sock geandersonlemonte/solidarize-docker
