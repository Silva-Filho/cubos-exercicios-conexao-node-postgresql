const conexao = require("../conexao");

const listarLivros = async (req, res) => {
    try {
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
        `;
        
        const { rows: livros } = await conexao.query(query);

        for (const livro of livros) {
            const query = `
                select 
                    count(status_emprestimo) 
                from emprestimos 
                where id_livro = $1
            `;
            // @ts-ignore
            const { rows: emprestimos } = await conexao.query(query, [livro.id_livro]);
            // @ts-ignore
            const { count } = emprestimos[0];
            // @ts-ignore
            livro.emprestimos = Number(count);
        }

        return res.status(200).json(livros);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterLivro = async (req, res) => {
    try {
        const { livro } = req;

        const query = `
                select 
                    count(status_emprestimo) 
                from emprestimos 
                where id_livro = $1
            `;
            // @ts-ignore
        const { rows: emprestimos } = await conexao.query(query, [livro.id_livro]);
        // @ts-ignore
        const { count } = emprestimos[0];
        // @ts-ignore
        livro.emprestimos = Number(count);

        return res.status(200).json(livro);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const cadastrarLivro = async (req, res) => {
    try {
        const { id_autor, nome, genero, editora, data_publicacao } = req.body;

        const query = `
            insert into livros (id_autor, nome, genero, editora, data_publicacao) 
            values ($1, $2, $3, $4, $5)
        `;

        const livroCadastrado = await conexao.query(query, [id_autor, nome, genero, editora, data_publicacao]);

        if (livroCadastrado.rowCount === 0) {
            return res.status(400).json("N??o foi poss??vel cadastar o livro.");
        }

        return res.status(200).json("Livro cadastrado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarLivro = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_autor, nome, genero, editora, data_publicacao } = req.body;

        const query = `
            update livros 
            set 
                id_autor = $1,
                nome = $2,
                genero = $3,
                editora = $4,
                data_publicacao = $5
            where id = $6
        `;

        const livroAtualizado = await conexao.query(query, [id_autor, nome, genero, editora, data_publicacao, id]);

        if (livroAtualizado.rowCount === 0) {
            return res.status(400).json("N??o foi poss??vel atualizar o livro.");
        }

        return res.status(200).json("O livro foi atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluirLivro = async (req, res) => {
    const { id } = req.params;

    try {
        const query = "delete from livros where id = $1";
        const livroExcluido = await conexao.query(query, [id]);

        if (livroExcluido.rowCount === 0) {
            return res.status(400).json("N??o foi poss??vel excluir o livro.");
        }

        return res.status(200).json("O livro foi excluido com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listarLivros,
    obterLivro,
    cadastrarLivro,
    atualizarLivro,
    excluirLivro
};
