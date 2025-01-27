import { Router } from 'express'
import CartManager from '../utils/fs.cartManager.js'

const cartsRouter = Router()


cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await CartManager.createCart()
    res.status(201).json(newCart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid
    const products = await CartManager.getCartById(cartId)
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});


export { cartsRouter }