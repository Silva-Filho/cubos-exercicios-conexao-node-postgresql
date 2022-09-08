const conexao = require( "../conexao" );
const { encontrarLivro } = require( "../utils/livros" );
const {
    schemaCadastroLivro,
    schemaAtualizacaoLivro
} = require( "../schemas/livros" );

const verificarLivroExiste = async ( req, res, next ) => {
    try {
        const url = req.url;

        if ( url.includes( "/livros" ) ) {
            const { id } = req.params;

            req.livro = await encontrarLivro( res, id );

            if ( !req.livro[ 0 ] ) {
                return;
            }
        }

        if ( url.includes( "/emprestimos" ) ) {
            const { id_livro } = req.body;

            if ( id_livro ) {
                req.livro = await encontrarLivro( res, id_livro );

                if ( !req.livro[ 0 ] ) {
                    return;
                }
            }
        }

        next();
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }
};

const verificarDadosCadastroLivro = async ( req, res, next ) => {
    try {
        await schemaCadastroLivro.validate( req.body );

        next();
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }

};

const verificarDadosAtualizacaoLivro = async ( req, res, next ) => {
    try {
        await schemaAtualizacaoLivro.validate( req.body );

        next();
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }

};

const verificarLivroPossuiEmprestimo = async ( req, res, next ) => {
    try {
        const { id } = req.params;

        const existeEmprestimos = await conexao.query( "select * from emprestimos where id_livro = $1", [ id ] );

        if ( existeEmprestimos.rowCount > 0 ) {
            return res.status( 400 ).json( "Não é possível excluir um livro que possui empréstimos." );
        }

        next();
    } catch ( error ) {
        return res.status( 400 ).json( error.message );
    }
};

module.exports = {
    verificarLivroExiste,
    verificarDadosCadastroLivro,
    verificarDadosAtualizacaoLivro,
    verificarLivroPossuiEmprestimo,
};
