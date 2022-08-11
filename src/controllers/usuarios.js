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
    const { id } = req.params;

    try {
        const queryUsuario = `
            select 
                id as id_usuario,
                nome as nome_usuario,
                idade,
                email,
                telefone,
                cpf
            from usuarios
            where id = $1
        `;

        const usuario = await conexao.query(queryUsuario, [id]);
        
        if (usuario.rowCount === 0) {
            return res.status(404).json("Usuário não encontrado.");
        }

        const queryEmprestimo = `
            select 
                e.id as id_emprestimo, 
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
        const { rows: emprestimos } = await conexao.query(queryEmprestimo, [usuario.rows[0].id_usuario]);

        // @ts-ignore
        usuario.rows[0].emprestimos = emprestimos;

        return res.status(200).json(usuario.rows[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const cadastrarUsuario = async (req, res) => {
    const { nome, idade, email, telefone, cpf } = req.body;
    
    try {
        if ( !nome || !email || !cpf ) {
            return res.status(400).json("Os campos nome, email e CPF são obrigatórios.");
        }
    
        const { rows: usuarios } = await conexao.query("select * from usuarios");

        const hasEmail = usuarios.some( item => {
            // @ts-ignore
            return item.email === email;
        } );

        const hasCpf = usuarios.some( item => {
            // @ts-ignore
            return item.cpf === cpf;
        } );
    
        if ( hasEmail || hasCpf ) {
            return res.status(400).json("O campo email ou CPF já está cadastrado.");
        }

        const query = `
            insert into usuarios (nome, idade, email, telefone, cpf) 
            values ($1, $2, $3, $4, $5)
        `;
        
        const usuario = await conexao.query(query, [nome, idade, email, telefone, cpf]);

        if (usuario.rowCount === 0) {
            return res.status(400).json("Não foi possível cadastrar o usuário.");
        }

        return res.status(200).json("Usuário cadastrado com sucesso.")
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, idade, email, telefone, cpf } = req.body;

    try {
        const usuario = await conexao.query("select * from usuarios where id = $1", [id]);

        if (usuario.rowCount === 0) {
            return res.status(404).json("Usuário não encontrado.");
        }

        if ( !nome || !email || !cpf ) {
            return res.status(400).json("Os campos nome, email e CPF são obrigatórios.");
        }

        // @ts-ignore
        const { rows: usuarios } = await conexao.query("select * from usuarios where id != $1", [usuario.rows[0].id]);

        const hasEmail = usuarios.some( item => {
            // @ts-ignore
            return item.email === email;
        } );

        const hasCpf = usuarios.some( item => {
            // @ts-ignore
            return item.cpf === cpf;
        } );

        if (hasEmail || hasCpf) {
            return res.status(400).json("O campo email ou CPF já está cadastrado.");
        }

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
        
        const usuarioAtualizado = await conexao.query(query, [nome, idade, email, telefone, cpf, id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(404).json("Não foi possível atualizar o usuário.");
        }

        return res.status(200).json("Usuário foi atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluirUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await conexao.query("select * from usuarios where id = $1", [id]);

        if (usuario.rowCount === 0) {
            return res.status(404).json("Usuário não encontrado.");
        }

        const existeEmprestimos = await conexao.query("select * from emprestimos where id_usuario = $1", [id]);
        console.log(existeEmprestimos);
        // if (existeEmprestimos.rowCount) ?????
        if (existeEmprestimos.rowCount > 0) {
            return res.status(400).json("Não é possível excluir um usuário que possui empréstimos.");
        }

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
