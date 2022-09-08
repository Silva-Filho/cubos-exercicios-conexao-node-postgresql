const conexao = require( "../conexao" );

async function encontrarLivro( res, idInformado ) {
    const queryLivro = `
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

    const { rows: livro } = await conexao.query( queryLivro, [ idInformado ] );

    if ( livro.length === 0 ) {
        return res.status(404).json( "Livro não encontrado." );
    }

    return livro;
}

module.exports = {
    encontrarLivro,
};
