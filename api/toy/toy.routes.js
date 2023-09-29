import express from 'express'
import { getToys, getToyById, addToy, updateToy, removeToy } from './toy.controller.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', addToy)
// toyRoutes.put('/:id', updateToy)
toyRoutes.put('/', updateToy)
toyRoutes.delete('/:id', removeToy)
