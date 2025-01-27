import express from 'express'
import { cartsRouter, productsRouter } from '../routes/index.js'
import { config } from '../config/index.js'

const initApp = () => {
  const app = express()


  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

  console.log(config.dirname)

  return app
}

export default initApp
