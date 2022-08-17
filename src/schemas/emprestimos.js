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
        // @ts-ignore
        .default(() => "pendente")
        .matches(/(pendente|devolvido)/),
    // status_emprestimo: yup.string().default({ status_emprestimo: "pendente" }),
});

module.exports = {
    schemaCadastroEmprestimo,
};
