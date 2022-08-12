const { yup } = require("../configs/yup");

const schemaCadastrarOuAtualizarAutor = yup.object().shape({
    nome: yup.string().required(),
    idade: yup.number().strict(),
});

module.exports = {
    schemaCadastrarOuAtualizarAutor,
};
