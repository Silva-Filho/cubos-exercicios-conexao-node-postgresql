const conexao = require("../conexao");

const verificarUsuarioExiste = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
            select 
                id as id_usuario,
                nome as nome_usuario,
                idade,
                email,
                telefone,
                cpf
            from usuarios
            where id = $1
        `;

        const { rows: usuario } = await conexao.query(query, [id]);
        
        if (usuario.length === 0) {
            return res.status(404).json("Usuário não encontrado.");
        }

        req.usuario = usuario[0];

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    } 
};

module.exports = {
    verificarUsuarioExiste,
};
