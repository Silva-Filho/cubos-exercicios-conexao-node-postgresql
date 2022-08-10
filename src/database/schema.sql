CREATE DATABASE biblioteca;

DROP TABLE IF EXISTS autores;

CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    idade SMALLINT
);

DROP TABLE IF EXISTS livros;

CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    id_autor INTEGER NOT NULL REFERENCES autores(id),
    nome TEXT NOT NULL,
    editora VARCHAR(100),
    genero VARCHAR(50) NOT NULL,
    data_publicacao DATE
    -- FOREIGN KEY (id_autor) REFERENCES autores(id)
);

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    idade SMALLINT,
    email VARCHAR(50) NOT NULL UNIQUE,
    telefone CHAR(11),
    -- cpf CHAR(11) NOT NULL UNIQUE,
    cpf BIGINT NOT NULL UNIQUE CHECK(cpf > 0 AND cpf<=99999999999),
);

DROP TABLE IF EXISTS emprestimos;

CREATE TYPE type_status_emprestimo AS ENUM ('pendente', 'devolvido');

CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id),
    id_livro INTEGER NOT NULL REFERENCES livros(id),
    -- o CHAR(9) faz surgir um espaço vazio no final do 'pendente' 
    -- para poder usar os 9 espaços determinados;
    -- talvez trocar para VARCHAR(9) resolva.
    -- status CHAR(9) DEFAULT 'pendente',
    status_emprestimo type_status_emprestimo DEFAULT 'pendente',
);
