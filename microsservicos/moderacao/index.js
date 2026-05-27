const axios = require('axios')
const express = require('express')
const app = express()

app.use(express.json())

const palavrasProibidas = [
  'avenida',
  'gato',
  'pastel',
  'uva',
  'fruta'
]

const ocorrencias = {}

let totalPalavrasLembretes = 0
let totalLembretes = 0

let totalPalavrasObservacoes = 0
let totalObservacoes = 0

const funcoes = {

  verificarPalavras: (texto) => {

    const palavrasEncontradas = palavrasProibidas.filter((palavra) =>
        texto.includes(palavra)
      )

    palavrasEncontradas.forEach((palavra) => {

      ocorrencias[palavra] = (ocorrencias[palavra] || 0) + 1

    })

    return palavrasEncontradas.length

  },

  LembreteCriado: async (lembrete) => {

    const quantidade = funcoes.verificarPalavras(lembrete.texto)

    totalPalavrasLembretes += quantidade
    totalLembretes++

    if(quantidade > 0){

      await axios.post(
        'http://localhost:10000/eventos',
        {
          tipo: 'LembreteBloqueado',
          dados: lembrete
        }
      )

    }

  },
  ObservacaoCriada: async (observacao) => {

    const quantidade = funcoes.verificarPalavras(observacao.texto)

    totalPalavrasObservacoes += quantidade
    totalObservacoes++

    if(quantidade > 0){

      await axios.post(
        'http://localhost:10000/eventos',
        {
          tipo: 'ObservacaoBloqueada',
          dados: observacao
        }
      )
    }

}

}

app.post('/eventos', (req, res) => {

  try {

    const evento = req.body

    console.log(evento)

    funcoes[evento.tipo](evento.dados)

  } catch (e) {}

  res.end()

})

app.get('/palavras/:palavra', (req, res) => {

  const palavra = req.params.palavra

  res.json({
    palavra,
    quantidade: ocorrencias[palavra] || 0
  })

})

app.get('/media/lembretes', (req, res) => {

  const media =
    totalLembretes === 0 ? 0 : totalPalavrasLembretes / totalLembretes

  res.json({ media })

})

app.get('/media/observacoes', (req, res) => {

  const media =
    totalObservacoes === 0 ? 0 : totalPalavrasObservacoes / totalObservacoes

  res.json({ media })

})

const port = 9000

app.listen(port, () => {

  console.log(`Moderacao. Porta ${port}.`)

})