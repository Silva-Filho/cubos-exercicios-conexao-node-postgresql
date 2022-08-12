const conexao = require("../conexao");
const { schemaCadastrarOuAtualizarAutor } = require("../schemas/autores");

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

const verificarNomeAutorFoiInformado = async (req, res, next) => {
    try {
        await schemaCadastrarOuAtualizarAutor.validate(req.body);

        next(); 
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const verificarAutorTemLivroCadastrado = async (req, res, next) => {
    try {
        const { autor } = req;

        const query = "select * from livros where id_autor = $1";
        // @ts-ignore
        const existeLivros = await conexao.query(query, [autor[0].id_autor]);

        if (existeLivros.rowCount > 0) {
            return res.status(400).json("Não é possível excluir um autor que possui livros cadastrados.");
        }
        
        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    verificarAutorExiste,
    verificarNomeAutorFoiInformado,
    verificarAutorTemLivroCadastrado
};
