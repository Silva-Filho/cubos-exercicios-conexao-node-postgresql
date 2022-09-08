const { yup } = require("../configs/yup");

const schemaCadastroEmprestimo = yup.object().shape({
    id_usuario: yup
        .number()
        .positive()
        .integer()
        .strict()
        .required(), 
    id_livro: yup
        .number()
        .positive()
        .integer()
        .strict()
        .required(),
    status_emprestimo: yup
        .string()
        .matches(/pendente|devolvido/),
});

module.exports = {
    schemaCadastroEmprestimo,
};
