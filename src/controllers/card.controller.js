import { CardService } from '*/services/card.service'
import { HttpStatusCode } from '*/utilities/constants'

const createNew = async (req, res) => {
  try {
    const result = await CardService.createNew(req.body)
    console.log(result)
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    console.error(err)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

export const CardController = { createNew }