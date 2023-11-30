const { select, insert } = require("../databases/bd_controller");

class Voluntary {

  async getAll() {
    const result = await select("*", "voluntario").execute();
    return result;
  }


  async add({
    id_voluntario,
  }) {
    await insert('voluntario').fields({
      id_voluntario,
    }).execute();
    return await select("*", "voluntario").where(`id_voluntario = '${id_voluntario}'`).execute();
  }

}


module.exports = Voluntary;