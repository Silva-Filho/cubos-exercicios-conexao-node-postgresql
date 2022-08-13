const conexao = require("../conexao");

async function obterAutor(res,idInformado) {
    const queryAutor = `
        select 
            a.id as id_autor,
            a.nome as nome_autor,
            a.idade
        from autores a 
        where a.id = $1
    `;

    const { rows: autor } = await conexao.query(queryAutor, [idInformado]);

    if (autor.length === 0) {
        return res.status(404).json("Autor não encontrado.");
    }

    return autor;
}

module.exports = {
    obterAutor,
};
