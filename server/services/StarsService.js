import { dbContext } from '../db/DbContext.js'
import { BadRequest, Forbidden } from '../utils/Errors.js'

class StarsService {
  async getAllStars() {
    return await dbContext.Stars.find({}).populate('creator', 'picture name')
  }

  async getStarById(id) {
    const star = await dbContext.Stars.findById(id).populate('creator', 'picture name')
    if (!star) {
      throw new BadRequest('No star found with that ID')
    }
    return star
  }

  async addStar(body) {
    const star = await dbContext.Stars.create(body)
    await star.populate('creator', 'picture name')
    return star
  }

  async editStar(update, userId) {
    const original = await this.getStarById(update.id)
    if (original.creatorId.toString() !== userId) {
      throw new Forbidden('nonono. not yours to edit')
    }
    original.name = update.name
    original.save()
    return original
  }

  async removeStar(id, userId) {
    const star = await this.getStarById(id)
    if (star.creatorId.toString() !== userId) {
      throw new Forbidden('nonono. not yours to delete')
    }
    dbContext.Stars.findByIdAndDelete(id)
    return star
  }
}

export const starsService = new StarsService()
