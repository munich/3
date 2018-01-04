const blockchain = requireFrom('core/blockchainManager')
const config = requireFrom('core/config')
const responder = requireFrom('api/responder')
const blocks = requireFrom('repositories/blocks')
const transformer = requireFrom('api/transformer')
const logger = requireFrom('core/logger')

class BlocksController {
  index(req, res, next) {
    blocks.all({
      order: [
        ['height', 'DESC']
      ],
      offset: parseInt(req.query.offset || 1),
      limit: parseInt(req.query.limit || 100)})
      .then(result => {
        responder.ok(req, res, {
          blocks: new transformer(req).collection(result.rows, 'block')
        })
      })

    next()
  }

  show(req, res, next) {
    blocks.findById(req.query.id)
      .then(result => {
        if (!result) {
          responder.error(req, res, {
            error: `Block with id ${req.query.id} not found`
          })
        } else {
          responder.ok(req, res, {
            blocks: new transformer(req).resource(result, 'block')
          })
        }
      })
      .catch(error => {
        logger.error(error)

        responder.error(req, res, {
          error: error
        })
      })

    next()
  }

  epoch(req, res, next) {
    responder.ok(req,res,{
      epoch: config.getConstants(blockchain.getInstance().lastBlock.data.height).epoch
    })

    next()
  }

  height(req, res, next) {
    let block = blockchain.getInstance().lastBlock.data

    res.send({
      height: block.height,
      id: block.id
    })

    next()
  }

  nethash(req, res, next) {
    res.send({
      nethash: config.network.nethash
    })

    next()
  }

  fee(req, res, next) {
    res.send({
      fee: config.getConstants(blockchain.getInstance().lastBlock.data.height).fees.send
    })

    next()
  }

  fees(req, res, next) {
    res.send({
      fees: config.getConstants(blockchain.getInstance().lastBlock.data.height).fees
    })

    next()
  }

  milestone(req, res, next) {
    responder.notImplemented(res, 'Method has not yet been implemented.')

    // res.send({
    //   milestone: __private.blockReward.calcMilestone(modules.blockchain.getLastBlock().height)
    // })

    next()
  }

  reward(req, res, next) {
    responder.notImplemented(res, 'Method has not yet been implemented.')

    // res.send({
    //   reward: __private.blockReward.calcReward(modules.blockchain.getLastBlock().height)
    // })

    next()
  }

  supply(req, res, next) {
    responder.notImplemented(res, 'Method has not yet been implemented.')

    // res.send({
    //   supply: __private.blockReward.calcSupply(modules.blockchain.getLastBlock().height)
    // })

    next()
  }

  status(req, res, next) {
    responder.notImplemented(res, 'Method has not yet been implemented.')

    // let block = blockchain.getInstance().lastBlock.data

    // res.send({
    //   epoch: config.getConstants(blockchain.getInstance().lastBlock.data.height).epoch,
    //   height: block.height,
    //   fee: config.getConstants(blockchain.getInstance().lastBlock.data.height).fees.send,
    //   milestone: __private.blockReward.calcMilestone(block.height),
    //   nethash: library.config.nethash,
    //   reward: __private.blockReward.calcReward(block.height),
    //   supply: __private.blockReward.calcSupply(block.height)
    // })

    next()
  }

}

module.exports = new BlocksController()
