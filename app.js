const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 3000 


var Orders = {
    Min: "",
    Rejected: "",
    Completed: ""
}
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send(Orders)
})

app.post('/', (req, res) => {
  console.log(req.body)
  req.body.MIN ? Orders.Min = req.body.MIN :
  req.body.Rejected ? Orders.Rejected = req.body.Rejected :
  Orders.Completed = req.body.Completed

  res.send({send: 'Got post request'})

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
