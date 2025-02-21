const express = require("express")
const mysql = require('mysql2')

const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

const dbHost = "localhost"
const dbUser = "root"
const dbPass = ""
const dbName = "apasbac"

const connection = mysql.createConnection({dbHost, dbUser, dbPass, dbName})

async function startServer(){
    try{
        
        app.listen(3000, () => {
            console.log(("Rodando"))
        })
    } catch(err){
        console.log("Erro ao conectar: ", err)
    }
}

startServer()