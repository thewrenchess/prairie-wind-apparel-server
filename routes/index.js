const { Router } = require('express')
const axios = require('axios')

const router = Router()

const WEATHER_API_KEY = process.env.WEATHER_API_KEY
if (!WEATHER_API_KEY) {
  throw new Error('missing WEATHER_API_KEY')
}

router.get('/', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  if (ip) {
    return axios.get('https://api.weatherapi.com/v1/current.json', {
      headers: {
        'XContent-Type': 'application/json'
      },
      params: {
        q: ip !== '127.0.0.1' ? ip : '18.206.69.11',
        key: WEATHER_API_KEY
      }
    })
      .then(response => {
        const data = response.data || {}
        const current = data.current || {}

        const {
          temp_f: tempF,
          condition
        } = current
        return res.json({
          tempF,
          condition
        })
      })
      .catch(error => {
        console.log(error)
        return res.status(400)
          .json({ message: 'No matching location found by ip address.' })
      })
  } else {
    return res.status(400)
      .json({ message: 'no IP address found' })
  }
})

module.exports = router
