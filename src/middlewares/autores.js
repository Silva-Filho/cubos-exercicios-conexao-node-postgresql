const conexao = require("../conexao");
const { schemaCadastrarOuAtualizarAutor } = require("../schemas/autores");
const { obterAutor } = require("../utils/autores");

const verificarAutorExiste = async (req, res, next) => {
    const url = req.url;

    if (url.includes("/autores")) {
        try {
            const { id } = req.params;

            req.autor = await obterAutor(res, id);

            if (!req.autor[0]) {
                return;
            }

            next();
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }

    if (url.includes("/livros")) {
        try {
            const { id_autor } = req.body;

            if (id_autor) {
                req.autor = await obterAutor(res, id_autor);

                if (!req.autor[0]) {
                    return;
                }
            }

            next();
        } catch (error) {
            return res.status(400).json(error.message);
        }
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
