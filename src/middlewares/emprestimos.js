const conexao = require("../conexao");
const { schemaCadastroEmprestimo } = require("../schemas/emprestimos");

const verificarEmprestimoExiste = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
            select 
                e.id as id_emprestimo, 
                u.nome as nome_usuario, 
                u.telefone, 
                u.email, 
                l.nome as nome_livro, 
                e.status_emprestimo 
            from emprestimos e
            left join usuarios u on e.id_usuario = u.id 
            left join livros l on e.id_livro = l.id 
            where e.id = $1
        `;

        const { rows: emprestimo } = await conexao.query(query, [id]);

        if (emprestimo.length === 0) {
            return res.status(404).json("Empréstimo não encontrado.");
        }

        req.emprestimo = emprestimo[0];

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    } 
};

const verificarDadosCadastroEmprestimo = async (req, res, next) => {
    try {
        await schemaCadastroEmprestimo.validate(req.body);
        
        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    verificarEmprestimoExiste,
    verificarDadosCadastroEmprestimo,
};
