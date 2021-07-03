const bcrypt = require('bcrypt');
const knex = require('../conexao');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    if (!nome_loja) {
        return res.status(404).json("O campo nome_loja é obrigatório");
    }

    try {
        const emailCadastrado = await knex('usuarios').where({email: email}).first();

        if (emailCadastrado) {
            return res.status(400).json("O email já existe");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios').insert({
            nome: nome,
            email: email,
            senha: senhaCriptografada,
            nome_loja: nome_loja
        }).returning('*');

        if (!usuario) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        const { senha: senhaRes, ...dadosUsuario } = usuario[0];  

        return res.status(200).json(dadosUsuario);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const { id } = req.usuario;

    if (!nome && !email && !senha && !nome_loja) {
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização');
    }

    try {
        // update usuarios set nome = $1, email = $2...
        const body = {};

        if (nome) {
            body.nome = nome;
        }

        if (email) {
            if (email !== req.usuario.email) {
                const emailCadastrado = await knex('usuarios').where({email: email}).first();

                if (emailCadastrado) {
                    return res.status(400).json("O email já existe");
                }
            }

            body.email = email;
        }

        if (senha) {
            body.senha = await bcrypt.hash(senha, 10);
        }

        if (nome_loja) {
            body.nome_loja = nome_loja;
        }

        const usuarioAtualizado = await knex('usuarios').update(body).where({ id: id })

        if (usuarioAtualizado === 0) {
            return res.status(400).json("O usuário não foi atualizado");
        }
        
        return res.status(200).json('Usuario foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}