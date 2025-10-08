const express = require('express')
let cors = require('cors')
const { send_message } = require('./message_slack')
const app = express()
const port = process.env.PORT || 3000 


let Orders = {
    Min: "",
    Rejected: "",
    Completed: "",
    Cancelled: "",
    Scheduling: ""
}
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send(Orders)
})

app.post('/', (req, res) => {
  req.body.MIN ? Orders.Min = req.body.MIN :
  req.body.Rejected ? Orders.Rejected = req.body.Rejected :
  req.body.Cancelled ? Orders.Cancelled = req.body.Cancelled :
  req.body.Scheduling ? Orders.Scheduling = req.body.Scheduling :
  Orders.Completed = req.body.Completed
  res.send({send: 'Got post request'})
})

app.post("/translations", async (req, res) => {
  try{
    await send_message(req.body)
    res.send({message: "Message sent"})
  }catch{
    res.send({message: "Error Ocurred"})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
