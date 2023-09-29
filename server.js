import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// import { toyService } from './services/toy.service.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { logger } from './services/logger.service.js'
logger.info('server.js loaded...')

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173','http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}




import { toyRoutes } from './api/toy/toy.routes.js'


app.use('/api/toy', toyRoutes)



app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log(`Server listening on port http://127.0.0.1:${port}/`)
})