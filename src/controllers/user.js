const { select, insert, update } = require("../databases/bd_controller");

class Users {

  async getAll({
    id
  }) {
    var result = [];
    if (id) {
      return this.getByID(id);
    } else {
      result = await select("*", "usuario").execute();
      result[0].is_ong = false;
    }
    return result;
  }

  async getByID(id) {
    const result = await select("*", "usuario").where(`id_usuario = ${id}`).execute();
    const ongs = await select("*", "ong").where(`id_ong = ${id}`).execute()
    result[0].is_ong = ongs.length > 0;
    result[0].ong = ongs[0];
    return result;
  }

  async updateUser({
    id,
    nome,
    email,
    senha
  }) {
    await update("usuario").set({
      nome,
      email,
      senha
    }).where(`id_usuario = ${id}`).execute();
    return await this.getByID(id)
  }

  async login({
    email,
    senha
  }) {
    const user = await select("*", "usuario").where(`email = '${email}' and senha ='${senha}'`).execute();
    if (user.length == 0) {
      throw new Error("Usuario e senha não conferem");
    }
    return user[0];
  }

  async add({
    nome,
    email,
    senha
  }) {
    await insert('usuario').fields({
      nome,
      email,
      senha
    }).execute();
    return await select("*", "usuario").where(`email = '${email}'`).execute();
  }
}


module.exports = Users;