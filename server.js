import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { toyService } from './services/toy.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))


app.get('/api/toy', (req, res) => {
    const filterBy = req.query
    toyService.query(filterBy)
        .then(toys => {
            res.send(toys)
        })
        .catch(err => {
            console.log('Cannot load toys', err)
            res.status(400).send('Cannot load toys')
        })
})

app.post('/api/toy', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add car')
    const { name, labels, price, inStock } = req.body

    const toy = {
        name,
        labels,
        price: +price,
        inStock
    }
    toyService.save(toy)
        .then(savedToy => {
            res.send(savedToy)
        })
        .catch(err => {
            console.log('Cannot add toy', err)
            res.status(400).send('Cannot add toy')
        })
})

app.put('/api/toy', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update car')
    const { name, labels, price, _id, createdAt, inStock } = req.body
    const toy = {
        _id,
        name,
        labels,
        price: +price,
        createdAt,
        inStock
    }
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch(err => {
            console.log('Cannot update toy', err)
            res.status(400).send('Cannot update toy')
        })

})

app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.get(toyId)
        .then(toy => {
            toy.msgs = ['Hello']
            res.send(toy)
        })
        .catch(err => {
            console.log('Cannot get toy', err)
            res.status(400).send(err)
        })
})

app.delete('/api/toy/:toyId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot delete car')

    const { toyId } = req.params
    toyService.remove(toyId)
        .then(msg => {
            res.send({ msg, toyId })
        })
        .catch(err => {
            console.log('Cannot delete toy', err)
            res.status(400).send('Cannot delete toy, ' + err)
        })
})


const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log(`Server listening on port http://127.0.0.1:${port}/`)
})