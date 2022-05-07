const knex = require("../config/db")
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const {generateToken, verifyToken} = require("../auth/jwt.auth")

app.use(express.json())

app.post("/register", async (req, res)=>{
  const {password, email, name} = req.body
  const encrypted = await bcrypt.hash(password, 10)
  const user = await knex("users").insert({
    name,
    email,
    password:encrypted
  })
  res.send(user)
})

app.post("/login", async (req, res)=>{
  try{
    const {email, password} = await req.body
    const data = await knex("users").where({email})
    console.log(data)
    if(data.length >0){
      const decrypted = await bcrypt.compare(password, data[0].password)
      if(decrypted){
        const token = generateToken(data[0].id)
        res.cookie("authToken", token)
        return res.send("you are logged in successfully")
      }
    }
    res.send("invalid credentials")

  }catch(err){
    res.send(err)
  }
})

app.get("/profile", verifyToken, (req, res)=>{
  res.send(`welcome ${req.userData[0].name}`)
})

app.get("/logout", (req, res)=>{
  res.clearCookie("authToken").send("logged out")
})

const port = 4000
app.listen(port)