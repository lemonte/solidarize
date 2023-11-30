const { select, insert, remove } = require("../databases/bd_controller");

class Likes {

  async getAll(){
    const result = await select("*", "curtida").execute();
    return result;
  }

  async delete({
    id_post,
    id_usuario
  }){
    await remove("curtida").where(`id_post = ${id_post} and id_usuario = ${id_usuario}`).execute();
  }

  async add({
    id_usuario,
    id_post
  }) {
    await insert('curtida').fields({
      id_usuario,
      id_post
    }).execute();
    return await select("*", "curtida").where(`id_post = '${id_post}' and id_usuario = '${id_usuario}'`).execute();
  }
}


module.exports = Likes;