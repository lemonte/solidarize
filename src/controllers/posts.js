const { select, insert } = require("../databases/bd_controller");
const Ongs = require("./ongs");
const Users = require("./user");

class Posts {
  async getAll({
    id
  }) {
    const reqOngs = new Ongs();
    const reqUsers = new Users();
    var result = [];
    if (id) {
      result = await select(" p.*, c.id_post is not null as favoritado", "post p").leftJoin('curtida c', `c.id_post = p.id_post and c.id_usuario = ${id}`).execute();
    } else {
      result = await select("*", "post").execute();
    }

    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      const ongs = await reqOngs.getOngById(element.id_usuario);
      const users = await reqUsers.getByID(element.id_usuario);
      element["user"] = ongs[0];
      element["user"] = users[0];
    }
    return result;
  }

  async add({
    id_usuario,
    url_image
  }) {
    await insert('post').fields({
      id_usuario,
      imagem: url_image
    }).execute();
    return await this.getAll({id: id_usuario})
  }

}


module.exports = Posts;