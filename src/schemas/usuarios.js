const { yup } = require("../configs/yup");

const schemaCadastroUsuario = yup.object().shape({
    nome: yup.string().required(), 
    idade: yup.number().strict(), 
    email: yup.string().email().required(), 
    telefone: yup.string(), 
    cpf: yup.number().strict(),
});

module.exports = {
    schemaCadastroUsuario,
};
