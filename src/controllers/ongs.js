const { select, insert } = require("../databases/bd_controller");

class Ongs {

  async getAll(){
    const result = await select("*", "ong").execute();
    return result;
  }

  async getOngById(id){
    const result = await select("*", "ong").where(`id_ong = ${id}`).execute();
    return result;
  }


  async add({
    id_ong,
    endereco
  }) {
    await insert('ong').fields({
      id_ong,
      endereco
    }).execute();
    return await select("*", "ong").where(`id_ong = '${id_ong}'`).execute();
  }

}


module.exports = Ongs;