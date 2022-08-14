const conexao = require("../conexao");
const { 
    schemaCadastroLivro, 
    schemaAtualizacaoLivro 
} = require("../schemas/livros");

const verificarLivroExiste = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
            select 
                l.id as id_livro, 
                l.nome as nome_livro, 
                a.nome as nome_autor, 
                l.genero, 
                l.editora, 
                l.data_publicacao 
            from livros l 
            left join autores a on l.id_autor = a.id 
            where l.id = $1
        `;

        const { rows: livro } = await conexao.query(query, [id]);

        if (livro.length === 0) {
            return res.status(404).json(`O id params ${id} informado não corresponde a nenhum livro cadastrado.`);
        }
        
        req.livro = livro[0];

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    } 
};

const verificarDadosCadastroLivro = async (req, res, next) => {
    try {
        await schemaCadastroLivro.validate(req.body);

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
    
};

const verificarDadosAtualizacaoLivro = async (req, res, next) => {
    try {
        await schemaAtualizacaoLivro.validate(req.body);

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
    
};

const verificarLivroPossuiEmprestimo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existeEmprestimos = await conexao.query("select * from emprestimos where id_livro = $1", [id]);

        if (existeEmprestimos.rowCount > 0) {
            return res.status(400).json("Não é possível excluir um livro que possui empréstimos.");
        }

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    verificarLivroExiste,
    verificarDadosCadastroLivro,
    verificarDadosAtualizacaoLivro,
    verificarLivroPossuiEmprestimo,
};
