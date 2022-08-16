const conexao = require("../conexao");

const listarUsuarios = async (req, res) => {
    try {
        const query = `
            select 
                id as id_usuario,
                nome as nome_usuario,
                idade,
                email,
                telefone,
                cpf
            from usuarios
        `;

        const { rows: usuarios } = await conexao.query(query);

        for (const usuario of usuarios) {
            const query = `
                select 
                    e.id as id_emprestimo, 
                    e.id_livro,
                    l.nome as nome_livro, 
                    l.editora, 
                    l.genero, 
                    l.data_publicacao, 
                    e.status_emprestimo
                from emprestimos e
                left join livros l on e.id_livro = l.id 
                where e.id_usuario = $1
            `;
            // @ts-ignore
            // const { rows: emprestimos } = await conexao.query(query, [usuario.id]);
            const { rows: emprestimos } = await conexao.query(query, [usuario.id_usuario]);

            // @ts-ignore
            usuario.emprestimos = emprestimos;
        }

        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterUsuario = async (req, res) => {
    try {
        const { usuario } = req;

        const query = `
            select 
                e.id as id_emprestimo,
                l.id as id_livro, 
                l.nome as nome_livro, 
                l.editora, 
                l.genero, 
                l.data_publicacao, 
                e.status_emprestimo
            from emprestimos e
            left join livros l on e.id_livro = l.id 
            where e.id_usuario = $1
        `;
        // @ts-ignore
        const { rows: emprestimos } = await conexao.query(query, [usuario.id_usuario]);

        // @ts-ignore
        usuario.emprestimos = emprestimos;

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, idade, email, telefone, cpf } = req.body;

        const query = `
            insert into usuarios (nome, idade, email, telefone, cpf) 
            values ($1, $2, $3, $4, $5)
        `;

        const usuario = await conexao.query(query, [nome, idade, email, telefone, cpf]);

        if (usuario.rowCount === 0) {
            return res.status(400).json("Não foi possível cadastrar o usuário.");
        }

        return res.status(200).json("Usuário cadastrado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nome_usuario, 
            idade, 
            email, 
            telefone, 
            cpf 
        } = req.usuario;

        const query = `
            update usuarios 
            set 
                nome = $1, 
                idade = $2, 
                email = $3, 
                telefone = $4, 
                cpf = $5 
            where id = $6
        `;

        const usuarioAtualizado = await conexao.query(
            query, 
            [
                nome_usuario, 
                idade, 
                email, 
                telefone, 
                cpf, 
                id
            ]
        );

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(404).json("Não foi possível atualizar o usuário.");
        }

        return res.status(200).json("Usuário foi atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluirUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const query = "delete from usuarios where id = $1";
        const usuarioExcluido = await conexao.query(query, [id]);

        if (usuarioExcluido.rowCount === 0) {
            return res.status(404).json("Não foi possível excluir o usuário.");
        }

        return res.status(200).json("Usuário foi excluido com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listarUsuarios,
    obterUsuario,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
};
