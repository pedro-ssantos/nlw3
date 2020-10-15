import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Orphanage from '../models/Orphanage'
import orphanageView from '../views/orphanages_view'

export default {
  async index(request: Request, response: Response) {
    const orphanageRepository = getRepository(Orphanage)
    const orphanages = await orphanageRepository.find()

    return response.json(orphanages)
  },

  async show(request: Request, response: Response) {
    const { id } = request.params
    const orphanageRepository = getRepository(Orphanage)
    const orphanage = await orphanageRepository.findOneOrFail(id)
    console.log(orphanage.images)
    return response.json(orphanage)
  },

  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      openig_hours,
      open_on_weekends
    } = request.body

    const orphanageRepository = getRepository(Orphanage)

    const requestImages = request.files as Express.Multer.File[]
    const images = requestImages.map((image) => {
      return { path: image.filename }
    })

    const orphanage = orphanageRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      openig_hours,
      open_on_weekends,
      images
    })

    await orphanageRepository.save(orphanage)

    return response.status(201).json(orphanage)
  }
}
