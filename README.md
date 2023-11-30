
# Visão Geral do Repositório: solidarize-docker

Bem-vindo ao repositório `solidarize-docker`. Esta imagem Docker permite que você execute rapidamente a aplicação Solidarize, uma plataforma intuitiva para login e gerenciamento de usuários.

## Como Usar Esta Imagem

### Usando Docker Run

1. **Baixar a Imagem**
   Abra o terminal e execute o comando:
   ```
   docker pull geandersonlemonte/solidarize-docker
   ```
   Isso irá baixar a imagem mais recente do `solidarize-docker` do Docker Hub.

2. **Executar a Imagem**
   Após o download, inicie a aplicação com o seguinte comando:
   ```
   docker run -p 5050:5050 geandersonlemonte/solidarize-docker
   ```
   Este comando mapeia a porta 5050 do container para a porta 5050 do seu host local.

3. **Acessar a Aplicação**
   Abra o navegador e acesse `http://localhost:5050`.
   Isso deve redirecioná-lo para a tela de login da aplicação Solidarize.

### Usando Docker Compose para Execução Completa com Banco de Dados

Para executar o projeto completo, incluindo o banco de dados, utilize o seguinte `docker-compose.yml`:

```yaml
version: "3"

services: 
  postgres:
    image: postgres:12
    container_name: pg_solidarize
    restart: always
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_USER: root
    ports:
      - "5432:5432"

  solidarize:
    image: geandersonlemonte/solidarize-docker
    ports:
      - "5050:5050"

volumes:
  db_data:
```

Após iniciar os containers, execute os seguintes scripts SQL no banco de dados para criar as tabelas necessárias:

```sql
-- Criando Tabelas

create table IF NOT EXISTS usuario(
  id_usuario serial primary key not null,
  nome varchar(300) not null,
  email varchar(100) not null,
  senha varchar(400) not null
);

create table IF NOT EXISTS voluntario(
  id_voluntario serial primary key not null references usuario(id_usuario)
);

create table IF NOT EXISTS ong(
  id_ong integer primary key not null references usuario(id_usuario),
  endereco varchar(300) not null
);

create table IF NOT EXISTS post(
  id_post serial primary key not null,
  imagem bytea,
  id_usuario integer not null references usuario(id_usuario)
);

create table IF NOT EXISTS curtida(
  id_post integer  references post(id_post) not null,
  id_usuario integer references usuario(id_usuario) not null,
  primary key(id_post, id_usuario)
);

alter table usuario
ADD CONSTRAINT uniqueEmail unique(email);
```

## Suporte e Contribuições

Para suporte, dúvidas ou contribuições, sinta-se à vontade para abrir um issue ou pull request neste repositório.
