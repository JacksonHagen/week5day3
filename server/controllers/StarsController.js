import { Auth0Provider } from '@bcwdev/auth0provider'
import { starsService } from '../services/StarsService.js'
import BaseController from '../utils/BaseController.js'

export class StarsController extends BaseController {
  constructor() {
    super('api/stars')
    this.router
      .get('', this.getAllStars)
      .get('/:id', this.getStarById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createStar)
      .put('/:id', this.editStar)
      .delete('/:id', this.removeStar)
  }

  async getAllStars(req, res, next) {
    try {
      const stars = await starsService.getAllStars()
      res.send(stars)
    } catch (error) {
      next(error)
    }
  }

  async getStarById(req, res, next) {
    try {
      const foundStar = await starsService.getStarById(req.params.id)
      res.send(foundStar)
    } catch (error) {
      next(error)
    }
  }

  async createStar(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const createdStar = await starsService.addStar(req.body)
      res.send(createdStar)
    } catch (error) {
      next(error)
    }
  }

  async editStar(req, res, next) {
    try {
      req.body.id = req.params.id
      const userId = req.userInfo.id
      const editedStar = await starsService.editStar(req.body, userId)
      res.send(editedStar)
    } catch (error) {
      next(error)
    }
  }

  async removeStar(req, res, next) {
    try {
      req.body.id = req.params.id
      const userId = req.userInfo.id
      const removedStar = await starsService.removeStar(req.body.id, userId)
      res.send(removedStar)
    } catch (error) {
      next(error)
    }
  }
}
