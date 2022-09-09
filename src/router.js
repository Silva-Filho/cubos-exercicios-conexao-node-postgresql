const express = require( "express" );
// Controllers:
const autores = require( "./controllers/autores" );
const livros = require( "./controllers/livros" );
const usuarios = require( "./controllers/usuarios" );
const emprestimos = require( "./controllers/emprestimos" );
// Middlewares:
const validarAutores = require( "./middlewares/autores" );
const validarLivros = require( "./middlewares/livros" );
const validarUsuarios = require( "./middlewares/usuarios" );
const validarEmprestimos = require( "./middlewares/emprestimos" );

const rotas = express();

// autores
rotas.get( "/autores", autores.listarAutores );
rotas.get( "/autores/:id",
    validarAutores.verificarAutorExiste,
    autores.obterAutor
);
rotas.post( "/autores",
    validarAutores.verificarNomeAutorFoiInformado,
    autores.cadastrarAutor
);
rotas.put( "/autores/:id",
    validarAutores.verificarNomeAutorFoiInformado,
    validarAutores.verificarAutorExiste,
    autores.atualizarAutor
);
rotas.delete( "/autores/:id",
    validarAutores.verificarAutorExiste,
    validarAutores.verificarAutorTemLivroCadastrado,
    autores.excluirAutor
);

// livros
rotas.get( "/livros", livros.listarLivros );
rotas.get( "/livros/:id",
    validarLivros.verificarLivroExiste,
    livros.obterLivro
);
rotas.post( "/livros",
    validarLivros.verificarDadosCadastroLivro,
    validarAutores.verificarAutorExiste,
    livros.cadastrarLivro,
);
rotas.put( "/livros/:id",
    validarLivros.verificarLivroExiste,
    validarLivros.verificarDadosAtualizacaoLivro,
    validarAutores.verificarAutorExiste,
    livros.atualizarLivro
);
rotas.delete( "/livros/:id",
    validarLivros.verificarLivroExiste,
    validarLivros.verificarLivroPossuiEmprestimo,
    livros.excluirLivro
);

// usuarios
rotas.get( "/usuarios", usuarios.listarUsuarios );
rotas.get( "/usuarios/:id",
    validarUsuarios.verificarUsuarioExiste,
    usuarios.obterUsuario
);
rotas.post( "/usuarios",
    validarUsuarios.verificarDadosCadastroUsuario,
    validarUsuarios.verificarCpfOuEmailUnicos,
    usuarios.cadastrarUsuario
);
rotas.put( "/usuarios/:id",
    validarUsuarios.verificarUsuarioExiste,
    validarUsuarios.verificarDadosAtualizacaoUsuario,
    validarUsuarios.verificarCpfOuEmailUnicos,
    usuarios.atualizarUsuario
);
rotas.delete( "/usuarios/:id",
    validarUsuarios.verificarUsuarioExiste,
    validarUsuarios.verificarUsuarioTemEmprestimoPendente,
    usuarios.excluirUsuario
);

// emprestimos
rotas.get( "/emprestimos", emprestimos.listarEmprestimos );
rotas.get( "/emprestimos/:id",
    validarEmprestimos.verificarEmprestimoExiste,
    emprestimos.obterEmprestimo
);
rotas.post( "/emprestimos",
    validarEmprestimos.verificarDadosCadastroEmprestimo,
    validarUsuarios.verificarUsuarioExiste,
    validarLivros.verificarLivroExiste,
    emprestimos.cadastrarEmprestimo
);
rotas.put( "/emprestimos/:id",
    validarEmprestimos.verificarDadosAtualizacaoEmprestimo,
    validarEmprestimos.verificarEmprestimoExiste,
    emprestimos.atualizarEmprestimo
);
rotas.delete( "/emprestimos/:id", emprestimos.excluirEmprestimo );

module.exports = rotas;
