import express from 'express'
import process from 'process'
import dotenv from 'dotenv'
import { options } from './config/mqtt'
import mqtt from 'mqtt'

dotenv.config()

const app = express()
const port = process.env.APP_PORT

// Connect to MQTT broker
const mqttClient = mqtt.connect('mqtt://localhost:1883', options)

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker')
  mqttClient.subscribe('test/topic', (err) => {
    if (!err) {
      console.log('Subscribed to test/topic')
    }
  })
})

mqttClient.on('message', (topic, message) => {
  console.log(`Received message on ${topic}: ${message.toString()}`)
})

// Express route to publish MQTT messages
app.get('/publish/:message', (req, res) => {
  const { message } = req.params
  mqttClient.publish('test/topic', message)
  res.send(`Message "${message}" published to test/topic`)
})

app.listen(port, () => {
  console.log(`Aeroponic app listening on port ${port}`)
})
