const conexao = require("../conexao");

const verificarAutorExiste = async (req, res, next) => {
    const { id } = req.params;

    try {
        const queryAutor = `
            select 
                a.id as id_autor,
                a.nome as nome_autor,
                a.idade
            from autores a 
            where a.id = $1
        `;

        const { rows: autor } = await conexao.query(queryAutor, [id]);

        if (autor.length === 0) {
            return res.status(404).json("Autor não encontrado.");
        }

        req.autor = autor;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};



module.exports = {
    verificarAutorExiste,
};
