const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'root',
  host: 'pg_solidarize',
  database: 'root',
  password: 'postgrespassword',
  port: 5432,
});



// Função para execução de consultas genéricas
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.queryParts = [];
    this.params = [];
  }

  where(condition) {
    this.queryParts.push(`WHERE ${condition}`);
    return this;
  }

  select(filter) {
    this.queryParts.push(`SELECT ${filter} FROM ${this.table}`);
    return this;
  }

  update() {
    this.queryParts.push(`UPDATE ${this.table} SET`);
    return this;
  }

  delete() {
    this.queryParts.push(`DELETE FROM ${this.table}`);
    return this;
  }

  insert() {
    this.queryParts.push(`INSERT INTO ${this.table}`);
    return this;
  }
  #objectToString(obj) {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}='${value}'`; // Aspas para strings
      } else {
        return `${key}=${value}`; // Sem aspas para não-strings
      }
    }).join(', ');
  }
  set(fields) {
    const columns = this.#objectToString(fields)
    this.queryParts.push(columns);
    return this;
  }

  fields(fields) {
    const columns = Object.keys(fields).join(', ');
    const values = Object.values(fields).map((value, index) => `$${this.params.length + index + 1}`);
    this.queryParts.push(`(${columns}) VALUES (${values})`);
    this.params.push(...Object.values(fields));
    return this;
  }

  join(table, condition) {
    this.queryParts.push(`JOIN ${table} ON ${condition}`);
    return this;
  }

  fullOuterJoin(table, condition) {
    this.queryParts.push(`FULL JOIN ${table} ON ${condition}`);
    return this;
  }

  innerJoin(table, condition) {
    this.queryParts.push(`INNER JOIN ${table} ON ${condition}`);
    return this;
  }

  leftJoin(table, condition) {
    this.queryParts.push(`LEFT JOIN ${table} ON ${condition}`);
    return this;
  }

  rightJoin(table, condition) {
    this.queryParts.push(`RIGHT JOIN ${table} ON ${condition}`);
    return this;
  }

  count() {
    this.queryParts.unshift('SELECT COUNT(*) FROM');
    return this;
  }

  subquery(subqueryAlias, subquery) {
    this.queryParts.push(`(${subquery}) AS ${subqueryAlias}`);
    return this;
  }

  async execute() {
    const query = `${this.queryParts.join(' ')};`;
    const result = await pool.query(query, this.params);
    return result.rows;
  }
}

const initDatabase = async () => {
  const query = `
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
  `;
  await pool.query(query, []);

}

// Funções de conveniência para facilitar a criação de consultas
const select = (filter, table) => {
  return new QueryBuilder(table).select(filter);
};

const update = (table) => {
  return new QueryBuilder(table).update();
};

const remove = (table) => {
  return new QueryBuilder(table).delete();
};

const insert = (table) => {
  return new QueryBuilder(table).insert();
};

module.exports = { query, select, update, remove, insert, initDatabase };