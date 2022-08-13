const { yup } = require("../configs/yup");

const schemaCadastroLivro = yup.object().shape({
    id_autor: yup.number().strict().required(), 
    nome: yup.string().strict().required(), 
    genero: yup.string().strict().required(), 
    editora: yup.string().strict(), 
    data_publicacao: yup.date(),
});

const schemaAtualizacaoLivro = yup.object().shape({
    id_autor: yup.number().strict(), 
    nome: yup.string().strict(), 
    genero: yup.string().strict(), 
    editora: yup.string().strict(), 
    data_publicacao: yup.date(),
});

module.exports = {
    schemaCadastroLivro,
    schemaAtualizacaoLivro,
};
