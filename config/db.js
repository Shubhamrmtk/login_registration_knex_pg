const knex = require("knex")({
  client:"pg",
  connection:'postgres://shubham:123@localhost:5432/reg_users'
})

knex.schema.createTable("users", table=>{
  table.increments("id")
  table.string("name")
  table.string("email")
  table.string("password")
}).then(()=>{
  console.log("table created")
}).catch(err=>{
  console.log("pg",err.message)
})

module.exports = knex