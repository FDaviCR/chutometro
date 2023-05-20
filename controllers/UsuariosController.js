const express = require("express");
const router = express.Router();
const User = require("../models/Usuarios");
const bcrypt = require('bcryptjs');

router.get("/admin/users", (req,res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req,res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{login: email}}).then( user =>{
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            var cad = null

            if(req.session.usuario == undefined){
                cad = "Usuário Primario";
            }else{
                cad = req.session.usuario;
            }

            User.create({
                login: email,
                password: hash,
                usuario: cad,
                ativo: true
            }).then(function(x){
                console.log(x.id);
                if(req.session.usuario == undefined){
                    res.redirect("/");
                }else{
                    res.redirect("/admin/users/");
                }
                
            }).catch((err)=>{
                console.log(err);
            });
        }else{
            res.redirect("/admin/users/create");
        }
    })

});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req,res) => {
    var login = req.body.email;
    var password = req.body.password;
    req.session.usuario = login;

    User.findOne({where:{login:login}}).then(user=>{
        if(user != undefined){
            var correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    login: user.login
                }
                res.redirect("/");
            }else{
                res.redirect("/login");
            }

        }else{
            res.redirect("/login");
        }
    });
});

router.post("/users/delete", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            User.update({ativo: false,usuario: req.session.usuario},{
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/users");
            })
        }else{
            res.redirect("/users");
            console.log("Não-número");
        }
    }else{
        res.redirect("/users");
    }
});

router.post("/users/reactivate", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            User.update({ativo: true,usuario: req.session.usuario},{
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/users");
            })
        }else{
            res.redirect("/users");
            console.log("Não-número");
        }
    }else{
        res.redirect("/users");
    }
});

router.get("/logout", (req,res) =>{
    req.session.user = undefined;
    res.redirect("/login");
});

module.exports = router;
