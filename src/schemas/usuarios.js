const { yup } = require("../configs/yup");

const schemaCadastroUsuario = yup.object().shape({
    nome: yup.string().required(), 
    idade: yup.number().strict(), 
    email: yup.string().email().required(), 
    telefone: yup.string().strict(), 
    cpf: yup.number().strict().required(),
});

const schemaAtualizacaoUsuario = yup.object().shape({
    nome: yup.string(), 
    idade: yup.number().strict(), 
    email: yup.string().email(), 
    telefone: yup.string().strict(), 
    cpf: yup.number().strict(),
});

module.exports = {
    schemaCadastroUsuario,
    schemaAtualizacaoUsuario,
};
