const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuarios = require('../models/Usuarios');
const Times = require('../models/Times');

/** ROTAS DE RENDERIZAÇÃO DE PÁGINAS */
router.get('/login', (req, res) => {
    res.render('admin/usuarios/login');
});

router.get('/admin/usuarios', (req, res) => {
    Usuarios.findAll({ include: [{ model: Times }] }).then((usuarios) => {
        res.render('admin/usuarios/index', { usuarios });
    });
});

router.get('/admin/usuarios/create', (req, res) => {
    Times.findAll().then((times) => {
        res.render('admin/usuarios/create', { times });
    });
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/login');
});

/** FUNÇÕES DE PROCESSAMENTO DE DADOS */
router.post('/usuarios/create', (req, res) => {
    const { usuario } = req.body;
    const { password } = req.body;
    const email = req.body.email === undefined ? '' : req.body.email;
    const timeId = req.body.timeId === undefined ? 1 : req.body.timeId;

    Usuarios.findOne({ where: { usuario } }).then((user) => {
        if (user === undefined || user === null) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            Usuarios.create({
                email,
                password: hash,
                usuario,
                timeId,
                ativo: true,
            }).then(() => {
                if (req.session.usuario === undefined) {
                    res.redirect('/');
                } else {
                    res.redirect('/admin/usuarios/');
                }
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.redirect('/admin/usuarios/create');
        }
    });
});

router.post('/authenticate', (req, res) => {
    const { usuario } = req.body;
    const { password } = req.body;
    req.session.usuario = usuario;

    Usuarios.findOne({ where: { usuario } }).then((user) => {
        if (user !== undefined) {
            const correct = bcrypt.compareSync(password, user.password);

            if (correct) {
                req.session.user = {
                    id: user.id,
                    login: user.usuario,
                };
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    });
});

router.post('/usuarios/delete', (req, res) => {
    const { id } = req.body;
    if (id !== undefined) {
        if (!Number.isNaN(id)) {
            Usuarios.update({ ativo: false, usuario: req.session.usuario }, {
                where: {
                    id,
                },
            }).then(() => {
                res.redirect('/admin/usuarios');
            });
        } else {
            res.redirect('/usuarios');
        }
    } else {
        res.redirect('/usuarios');
    }
});

router.post('/usuarios/reactivate', (req, res) => {
    const { id } = req.body;
    if (id !== undefined) {
        if (!Number.isNaN(id)) {
            Usuarios.update({ ativo: true, usuario: req.session.usuario }, {
                where: {
                    id,
                },
            }).then(() => {
                res.redirect('/admin/usuarios');
            });
        } else {
            res.redirect('/usuarios');
        }
    } else {
        res.redirect('/usuarios');
    }
});

module.exports = router;
