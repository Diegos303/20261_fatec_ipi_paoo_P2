const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const servicos = {
  lembretes:     'http://localhost:4000/lembretes',
  observacoes:   'http://localhost:5000/lembretes/1/observacoes',
  consulta:      'http://localhost:6000/lembretes',
  classificacao: 'http://localhost:7000/eventos',
  barramento:    'http://localhost:10000/eventos'
}

app.get('/monitoramento', async (req, res) => {
  const resultado = {}
  try {
    await axios.get(servicos.lembretes)
    resultado.lembretes = 'online'
  } 
  catch(e) {
    resultado.lembretes = 'offline'
  }

  try {
    await axios.get(servicos.observacoes)
    resultado.observacoes = 'online'
  } 
  catch(e) {
    resultado.observacoes = 'offline'
  }

  try {
    await axios.get(servicos.consulta)
    resultado.consulta = 'online'
  } 
  catch(e) {
    resultado.consulta = 'offline'
  }

  try {
    await axios.get(servicos.barramento)
    resultado.barramento = 'online'
  } 
  catch(e) {
    resultado.barramento = 'offline'
  }
  try {
    await axios.get(servicos.classificacao)
    resultado.classificacao = 'online'
  }
  catch(e) {
    resultado.classificacao = 'offline'
  }

  res.json(resultado)
})

app.post('/eventos', (req, res) => {
  res.end()
})

const port = 8000
app.listen(port, () => {
  console.log(`Monitoramento. Porta ${port}.`)
})