const express = require("express");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser"); //Importando Body Parser
const connection = require("./database/database");
const adminAuth = require("./middleware/adminAuth");

const usersController = require("./controllers/UsuariosController");

// View engine
app.set('view engine','ejs');

//Sessions
app.use(session({
    secret: "youshallnotpass", cookie: { maxAge: 14400000},
    saveUninitialized: true,
    resave: true
}))

//Arquivos estaticos
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.use('/public/img/', express.static('./public/img'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection.authenticate()
    .then(()=>{
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })

app.use("/", usersController);

// Router
app.get("/", adminAuth, (req, res) => {
    res.render("index.ejs");
})

// End Router
app.listen(3000, () => {
    console.log("O servidor está rodando!")
})



