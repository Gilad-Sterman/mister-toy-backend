import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'


async function query(filterBy = { txt: '' }) {
    const { sortBy } = filterBy
    try {
        const criteria = {
            name: { $regex: filterBy.txt, $options: 'i' },
            $or: [
                { inStock: (filterBy.inStock === 'all') ? true : filterBy.inStock },
                { inStock: (filterBy.inStock === 'all') ? false : filterBy.inStock }],
        }
        if (filterBy.labels !== 'all') criteria.labels = { $in: filterBy.labels }

        const collection = await dbService.getCollection('toy')
        let toys = await collection.find(criteria).sort({ [sortBy]: 1 }).toArray()
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        toy.createdAt = Date.now()
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
            labels: toy.labels,
            inStock: toy.inStock,
            createdAt: toy.createdAt
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    // addToyMsg,
    // removeToyMsg
}