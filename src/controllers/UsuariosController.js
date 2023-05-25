const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuarios = require('../models/Usuarios');

router.get('/admin/usuarios', (req, res) => {
    Usuarios.findAll().then((users) => {
        res.render('admin/usuarios/index', { users });
    });
});

router.get('/admin/usuarios/create', (req, res) => {
    res.render('admin/usuarios/create');
});

router.post('/usuarios/create', (req, res) => {
    const { usuario } = req.body;
    const { password } = req.body;
    const email = '';

    Usuarios.findOne({ where: { usuario } }).then((user) => {
        if (user == undefined) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            Usuarios.create({
                email,
                password: hash,
                usuario,
                ativo: true,
            }).then((x) => {
                console.log(x);
                if (req.session.usuario == undefined) {
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

router.get('/login', (req, res) => {
    res.render('admin/usuarios/login');
});

router.post('/authenticate', (req, res) => {
    const { usuario } = req.body;
    const { password } = req.body;
    req.session.usuario = usuario;

    Usuarios.findOne({ where: { usuario } }).then((user) => {
        if (user != undefined) {
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
    if (id != undefined) {
        if (!isNaN(id)) {
            Usuarios.update({ ativo: false, usuario: req.session.usuario }, {
                where: {
                    id,
                },
            }).then(() => {
                res.redirect('/admin/usuarios');
            });
        } else {
            res.redirect('/users');
            console.log('Não-número');
        }
    } else {
        res.redirect('/users');
    }
});

router.post('/usuarios/reactivate', (req, res) => {
    const { id } = req.body;
    if (id != undefined) {
        if (!isNaN(id)) {
            Usuarios.update({ ativo: true, usuario: req.session.usuario }, {
                where: {
                    id,
                },
            }).then(() => {
                res.redirect('/admin/usuarios');
            });
        } else {
            res.redirect('/users');
            console.log('Não-número');
        }
    } else {
        res.redirect('/users');
    }
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/login');
});

module.exports = router;
