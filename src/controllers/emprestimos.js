const conexao = require("../conexao");

const listarEmprestimos = async (req, res) => {
    try {
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
        `;

        const { rows: emprestimos } = await conexao.query(query);

        return res.status(200).json(emprestimos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterEmprestimo = async (req, res) => {
    try {
        const { emprestimo } = req;

        return res.status(200).json(emprestimo);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const cadastrarEmprestimo = async (req, res) => {
    const { id_usuario, id_livro } = req.body;

    try {
        if ( !id_usuario || !id_livro ) {
            return res.status(400).json("Os campos id_usuario e id_livro são obrigatórios.");
        }

        const usuario = await conexao.query("select * from usuarios where id = $1", [id_usuario]);

        if (usuario.rowCount === 0) {
            return res.status(404).json("Usuario não encontrado.");
        }

        const livro = await conexao.query("select * from livros where id = $1", [id_livro]);

        if (livro.rowCount === 0) {
            return res.status(404).json("Livro não encontrado.");
        }

        const query = "insert into emprestimos (id_usuario, id_livro) values ($1, $2)";
        const emprestimo = await conexao.query(query, [id_usuario, id_livro]);

        if (emprestimo.rowCount === 0) {
            return res.status(400).json("Não foi possível cadastrar o empréstimo.");
        }

        return res.status(200).json("Empréstimo cadastrado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarEmprestimo = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!status) {
            return res.status(400).json("O campo status é obrigatório.");
        }
        
        if (status !== "pendente" && status !== "devolvido") {
            return res.status(400).json("Status informado incompatível com 'pendente' ou 'devolvido'.");
        }

        const emprestimo = await conexao.query("select * from emprestimos where id = $1", [id]);

        if (emprestimo.rowCount === 0) {
            return res.status(404).json("Empréstimo não encontrado.");
        }

        const query = "update emprestimos set status = $1 where id = $2";
        const emprestimoAtualizado = await conexao.query(query, [status, id]);

        if (emprestimoAtualizado.rowCount === 0) {
            return res.status(404).json("Não foi possível atualizar o empréstimo.");
        }

        return res.status(200).json("Empréstimo foi atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluirEmprestimo = async (req, res) => {
    const { id } = req.params;

    try {
        const emprestimo = await conexao.query("select * from emprestimos where id = $1", [id]);

        if (emprestimo.rowCount === 0) {
            return res.status(404).json("Empréstimo não encontrado.");
        }

        // @ts-ignore
        if (emprestimo.rows[0].status.trim() === "pendente") {
            return res.status(404).json("Não é possível excluir empréstimo com status igual a pendente.");
        }

        const query = "delete from emprestimos where id = $1";
        const emprestimoExcluido = await conexao.query(query, [id]);

        if (emprestimoExcluido.rowCount === 0) {
            return res.status(404).json("Não foi possível excluir o empréstimo.");
        }

        return res.status(200).json("Empréstimo foi excluído com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listarEmprestimos,
    obterEmprestimo, 
    cadastrarEmprestimo, 
    atualizarEmprestimo,
    excluirEmprestimo
};
