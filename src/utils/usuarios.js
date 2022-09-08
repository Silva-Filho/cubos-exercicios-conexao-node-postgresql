const conexao = require( "../conexao" );

async function encontrarUsuario( res, idInformado ) {
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

    const { rows: usuario } = await conexao.query( query, [ idInformado ] );

    if ( usuario.length === 0 ) {
        return res.status( 404 ).json( "Usuário não encontrado." );
    }

    return usuario;
}

module.exports = {
    encontrarUsuario,
};
