import express from 'express'
import process from 'process'
import dotenv from 'dotenv'
import mqtt from 'mqtt'
import cors from 'cors'

dotenv.config()

const app = express()
const port = process.env.APP_PORT

let phValue = 0

// Connect to MQTT broker
const mqttClient = mqtt.connect('mqtt://localhost:1883')

app.use(cors()) // Enable CORS for all routes
app.use(express.json())

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker')
  mqttClient.subscribe('esp32/sensor/ph', (err) => {
    if (!err) {
      console.log('Subscribed to esp32/sensor/ph')
    }
  })

  mqttClient.subscribe('esp32/actuator/pump', (err) => {
    if (!err) {
      console.log('Subscribed to esp32/actuator/pump')
    }
  })
})

mqttClient.on('message', (topic, message) => {
  if (topic === 'esp32/sensor/ph') {
    try {
      // Parsing pesan MQTT menjadi JSON
      const data = JSON.parse(message.toString())

      // Mengakses nilai dari data JSON
      phValue = data.ph

      console.log(`pH Value: ${phValue}`)
    } catch (error) {
      console.error('Failed to parse JSON message:', error)
    }
  }

  if (topic === 'esp32/actuator/pump') {
    try {
      console.log(message.toString())
    } catch (err) {
      console.log(err)
    }
  }
})

// Express route to publish MQTT messages
app.get('/publish/:message', (req, res) => {
  const { message } = req.params
  mqttClient.publish('esp32/sensor/ph', message)
  res.send(`Message "${message}" published to esp32/sensor/ph`)
})

// Route to fetch pH data
app.get('/api/ph', (req, res) => {
  res.json({
    data: {
      ph: phValue,
    },
    statusCode: 200,
    message: 'Get Data Successfully',
  })
})

// Route to control relay
app.post('/api/relay', (req, res) => {
  const { state } = req.body // State can be "ON" or "OFF"

  if (state === 'ON' || state === 'OFF') {
    mqttClient.publish('esp32/actuator/pump', state)
    res.json({
      statusCode: 200,
      message: `Relay turned ${state}`,
    })
  } else {
    res.status(400).json({
      statusCode: 400,
      message: 'Invalid relay state. Use "ON" or "OFF".',
    })
  }
})

app.listen(port, () => {
  console.log(`Aeroponic app listening on port ${port}`)
