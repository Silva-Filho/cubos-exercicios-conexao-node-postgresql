const conexao = require("../conexao");
const { 
    schemaCadastroUsuario, 
    schemaAtualizacaoUsuario 
} = require("../schemas/usuarios");

const verificarUsuarioExiste = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
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

        const { rows: usuario } = await conexao.query(query, [id]);
        
        if (usuario.length === 0) {
            return res.status(404).json("Usuário não encontrado.");
        }

        req.usuario = usuario[0];

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    } 
};

const verificarDadosCadastroUsuario = async (req, res, next) => {
    try {
        await schemaCadastroUsuario.validate(req.body);

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const verificarCpfOuEmailUnicos = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email, cpf } = req.body;

        const { rows: usuarios } = await conexao.query("select * from usuarios");

        const usuariosFiltrados = req.method === "PUT" ? 
            usuarios.filter( item => {
                // @ts-ignore
                return item.id !== Number(id);
            }) :
            usuarios;

        const hasEmail = usuariosFiltrados.some( item => {
            // @ts-ignore
            return item.email === email;
        } );

        const hasCpf = usuariosFiltrados.some( item => {
            // @ts-ignore
            return Number(item.cpf) === cpf;
        } );
    
        if ( hasEmail || hasCpf ) {
            return res.status(400).json("O campo email ou CPF já está cadastrado.");
        }

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const verificarDadosAtualizacaoUsuario = async (req, res, next) => {
    try {
        await schemaAtualizacaoUsuario.validate(req.body);

        const { nome, idade, email, telefone, cpf } = req.body;

        let { usuario } = req;

        usuario = {
            nome_usuario: nome ? nome : usuario.nome_usuario,
            idade: idade ? idade : usuario.idade,
            email: email ? email : usuario.email,
            telefone: telefone ? telefone : usuario.telefone,
            cpf: cpf ? cpf : usuario.cpf,
        };

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const verificarUsuarioTemEmprestimoPendente = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
            select * 
            from emprestimos 
            where id_usuario = $1 and status_emprestimo ='pendente'
        `;
        const { rows: emprestimoPendente } = await conexao.query(query, [id]);
        
        if (emprestimoPendente.length > 0) {
            return res
                .status(400)
                .json("Não é possível excluir usuário que possui empréstimo(s) pendente(s).");
        }
        
        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    verificarUsuarioExiste,
    verificarDadosCadastroUsuario,
    verificarCpfOuEmailUnicos,
    verificarDadosAtualizacaoUsuario,
    verificarUsuarioTemEmprestimoPendente,
};
