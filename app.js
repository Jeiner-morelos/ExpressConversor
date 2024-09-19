const express = require('express')
const app = express()
const port = 3000
// Get the client
const mysql = require('mysql2/promise');
const cors = require('cors')
const session = require('express-session')


// Create the connection to database
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'login',
});

app.use(cors({
  origin :'http://localhost:5173',
  credentials:true
}))

app.use(session({
  secret: 'cookie_secret',
  resave:true,
  saveUninitialized: true,
  cookie: { 
    secure: true,
   }
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/login', async (req, res) => {
  const datos = req.query;
  // A simple SELECT query

try {

  const [results, fields] = await connection.query(
    "SELECT * FROM `usuarios` WHERE `usuario` = ? AND `clave` = ?",
    [datos.usuario, datos.clave]
);
    if (results.length>0){
      req.session.usuario = datos.usuario;
      res.status(200).send('Inicio de seccion correcto')
    }else{
      res.status(401).send('Usuario incorrecto')
    }

  console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
  console.log(err);
}
  console.log(datos)
  
})

//funcion registrarse.
app.get('/registrarse', async (req, res) => {
  const datos = req.query;
  // A simple SELECT query

try {

  const [results, fields] = await connection.query(
    "INSERT INTO `usuarios` (`id`, `usuario`, `clave`) VALUES (NULL, ?, ?)",
    [datos.usuario, datos.clave]
);
    if (results.affectedRows >0){
      req.session.usuario = datos.usuario;
      res.status(200).send('Registro correcto')
    }else{
      res.status(401).send('Usuario no registrado')
    }

  console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
  console.log(err);
   res.status(500).send('Error de servidor')
}
  
})




//funcion validar
app.get('/validar', (req, res) => {
  if (req.session.usuario){
    res.status(200).send('session validada')
  }else{
    res.status(401).send(' usuario no autorizado')
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})