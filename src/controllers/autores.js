const conexao = require("../conexao");

/* 
    rowCount = quantidade de registros;
    rows = aquilo que foi registrado;
*/
/* 
    Talvez fazer um query com select + join? 
*/

const listarAutores = async (req, res) => {
    try {
        const query = `
            select 
                a.id as id_autor,
                a.nome as nome_autor,
                a.idade
            from autores a
        `;

        const { rows: autores } = await conexao.query(query);

        for (const autor of autores) {
            const query = `
                select 
                    l.id as id_livro, 
                    l.nome as nome_livro, 
                    l.editora, 
                    l.genero, 
                    l.data_publicacao
                from livros l 
                where l.id_autor = $1
            `;
            // @ts-ignore
            const { rows: livros } = await conexao.query(query, [autor.id_autor]);
            // @ts-ignore
            autor.livros = livros;
            // autor.livros = livros.length ? livros : "Não há livros cadastrados";
            // @ts-ignore
            for (const livro of autor.livros) {
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
        }

        return res.status(200).json(autores);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterAutor = async (req, res) => {
    const { autor } = req;

    try {
        const queryLivros = `
            select 
                l.id as id_livro, 
                l.nome as nome_livro, 
                l.editora, 
                l.genero, 
                l.data_publicacao
            from livros l 
            where l.id_autor = $1
        `;
        // @ts-ignore
        const { rows: livros } = await conexao.query(queryLivros, [autor[0].id_autor]);
        // @ts-ignore
        autor[0].livros = livros;
        // @ts-ignore
        for (const livro of autor[0].livros) {
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

        return res.status(200).json(autor[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const cadastrarAutor = async (req, res) => {
    const { nome, idade } = req.body;
    
    try {
        const query = "insert into autores (nome, idade) values ($1, $2)";
        const autor = await conexao.query(query, [nome, idade]);

        if (autor.rowCount === 0) {
            return res.status(400).json("Não foi possível cadastrar o autor.");
        }

        return res.status(200).json("Autor cadastrado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarAutor = async (req, res) => {
    const { id } = req.params;
    const { nome, idade } = req.body;

    try {
        if (!nome) {
            return res.status(400).json("O campo nome é obrigatório.");
        }

        const autor = await conexao.query("select * from autores where id = $1", [id]);

        if (autor.rowCount === 0) {
            return res.status(404).json("Autor não encontrado");
        }

        const query = "update autores set nome = $1, idade = $2 where id = $3";
        const autorAtualizado = await conexao.query(query, [nome, idade, id]);

        if (autorAtualizado.rowCount === 0) {
            return res.status(404).json("Não foi possível atualizar o autor.");
        }

        return res.status(200).json("Autor foi atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluirAutor = async (req, res) => {
    const { id } = req.params;

    try {
        const autor = await conexao.query("select * from autores where id = $1", [id]);

        if (autor.rowCount === 0) {
            return res.status(404).json("Autor não encontrado.");
        }

        // @ts-ignore
        const existeLivros = await conexao.query("select * from livros where id_autor = $1", [autor.rows[0].id]);

        if (existeLivros.rowCount > 0) {
            return res.status(400).json("Não é possível excluir um autor que possui livros cadastrados.");
        }

        const query = "delete from autores where id = $1";
        const autorExcluido = await conexao.query(query, [id]);

        if (autorExcluido.rowCount === 0) {
            return res.status(404).json("Não foi possível excluir o autor.");
        }

        return res.status(200).json("Autor foi excluido com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listarAutores,
    obterAutor,
    cadastrarAutor,
    atualizarAutor,
    excluirAutor
};
