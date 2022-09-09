const conexao = require( "../conexao" );

const listarEmprestimos = async ( req, res ) => {
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

        const { rows: emprestimos } = await conexao.query( query );

        return res.status( 200 ).json( emprestimos );
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }
};

const obterEmprestimo = async ( req, res ) => {
    try {
        const { emprestimo } = req;

        return res.status( 200 ).json( emprestimo );
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }
};

const cadastrarEmprestimo = async ( req, res ) => {
    try {
        const { id_usuario, id_livro } = req.body;

        const query = "insert into emprestimos (id_usuario, id_livro) values ($1, $2)";
        const emprestimo = await conexao.query( query, [ id_usuario, id_livro ] );

        if ( emprestimo.rowCount === 0 ) {
            return res.status( 400 ).json( "Não foi possível cadastrar o empréstimo." );
        }

        return res.status( 200 ).json( "Empréstimo cadastrado com sucesso." );
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }
};

const atualizarEmprestimo = async ( req, res ) => {
    const { id } = req.params;
    const { status_emprestimo } = req.body;

    try {
        const query = "update emprestimos set status_emprestimo = $1 where id = $2";
        const emprestimoAtualizado = await conexao.query( query, [ status_emprestimo, id ] );

        if ( emprestimoAtualizado.rowCount === 0 ) {
            return res.status( 404 ).json( "Não foi possível atualizar o empréstimo." );
        }

        return res.status( 200 ).json( "Empréstimo foi atualizado com sucesso." );
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }
};

const excluirEmprestimo = async ( req, res ) => {
    try {
        const { id } = req.params;        
        const query = "delete from emprestimos where id = $1";
        const emprestimoExcluido = await conexao.query( query, [ id ] );

        if ( emprestimoExcluido.rowCount === 0 ) {
            return res.status( 404 ).json( "Não foi possível excluir o empréstimo." );
        }

        return res.status( 200 ).json( "Empréstimo foi excluído com sucesso." );
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }
};

module.exports = {
    listarEmprestimos,
    obterEmprestimo,
    cadastrarEmprestimo,
    atualizarEmprestimo,
    excluirEmprestimo
};
