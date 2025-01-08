import process from 'process'
import dotenv from 'dotenv'

dotenv.config()

export const options = {
  host: process.env.HIVEMQ_HOST,
  port: process.env.MQTT_PORT,
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
}
