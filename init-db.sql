-- -- Criando Tabelas -- -- -- -- 
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
ADD CONSTRAINT uniqueEmail unique(email)