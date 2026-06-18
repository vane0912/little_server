const express = require('express')
let cors = require('cors')
const { send_message, send_report } = require('./message_slack')
const { runAutomations } = require('./github')
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

// Flow 1: "Run automation webhook" -> "HTTP Request" -> "Update deploy url"
app.post("/run-automations", async (req, res) => {
  try {
    console.log(req.body)
    await runAutomations(req.body)
    res.send({ message: "Automations triggered" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Error Ocurred", error: error.message })
  }
})

// Flow 2: "Get report webhook" -> "Send results message to Slack"
app.post("/receive-report", async (req, res) => {
  try {
    console.log(req.body)
    await send_report(req.body)
    res.send({ message: "Report sent" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Error Ocurred", error: error.message })
  }
})

app.post("/translations", async (req, res) => {
  try{
    console.log(req.body)
    await send_message(req.body)
    res.send({message: "Message sent"})
  }catch(error){
    console.log(error)
    res.send({message: "Error Ocurred"})
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
