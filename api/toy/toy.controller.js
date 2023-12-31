import { logger } from "../../services/logger.service.js";
import { socketService } from "../../services/socket.service.js";
import { toyService } from "./toy.service.js";

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',]

export async function getToys(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            inStock: (req.query.inStock === 'all') ? 'all' : (req.query.inStock === 'true') ? true : false,
            sortBy: req.query.sortBy || 'name',
            labels: req.query.labels || 'all',
        }
        logger.debug('Getting Toys', filterBy)
        console.log('Getting Toys', filterBy)
        const toys = await toyService.query(filterBy)
        res.json(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        console.log('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req

    try {
        const toy = req.body
        // toy.owner = loggedinUser
        const addedToy = await toyService.add(toy)
        socketService.broadcast({ type: 'toy-added', data: addedToy, userId: loggedinUser._id })
        res.json(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const toy = req.body
        console.log(toy)
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        await toyService.remove(toyId)
        socketService.broadcast({ type: 'toy-removed', data: toyId, userId: loggedinUser._id })
        res.send()
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}