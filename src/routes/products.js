import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { config } from '../config/index.js'
import { v4 as uuidv4 } from 'uuid'
import { validateInputProducts } from '../middlewares/validateInputProducts.js'

export const productsRouter = Router()

const pathToProducts = path.join(config.dirname, '/src/data/products.json')

console.log(pathToProducts)
productsRouter.get('/', async (req, res) => {
  try { 
    let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
    const products = JSON.parse(productsString)
    res.send({ products })
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener los productos', error })
  }
})

productsRouter.post('/', validateInputProducts, async (req, res) => {
  try {
    let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
    const products = JSON.parse(productsString)
    const id = uuidv4()

    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body

    const product = {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    }

    products.push(product)

    const productsStringified = JSON.stringify(products, null, '\t')
    await fs.promises.writeFile(pathToProducts, productsStringified)
    res.send({ message: 'Producto creado', data: product })
  } catch (error) {
    res.status(500).send({ message: 'Error al crear el producto', error })
  }
})


// GET /api/products/:id - Obtener un producto por ID
productsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
    const products = JSON.parse(productsString)

    const product = products.find((p) => p.id === id)

    if (!product) {
      return res.status(404).send({ message: 'Producto no encontrado' })
    }

    res.send({ product })
  } catch (error) {
    res.status(500).send({ message: 'Error al buscar el producto', error })
  }
})

// DELETE /api/products/:id - Eliminar un producto por ID
productsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
    let products = JSON.parse(productsString);

    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return res.status(404).send({ message: 'Producto no encontrado' })
    }

    const deletedProduct = products.splice(productIndex, 1)

    const productsStringified = JSON.stringify(products, null, '\t')
    await fs.promises.writeFile(pathToProducts, productsStringified)

    res.send({ message: 'Producto eliminado', data: deletedProduct })
  } catch (error) {
    res.status(500).send({ message: 'Error al eliminar el producto', error })
  }
})

// PUT /api/products/:id - Actualizar un producto por ID
productsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    // Leer los productos actuales desde el archivo
    let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
    let products = JSON.parse(productsString)

    // Buscar el producto que corresponde al id
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return res.status(404).send({ message: 'Producto no encontrado' })
    }

    // Obtener el producto actual
    const productToUpdate = products[productIndex]

    // Actualizar los campos del producto, asegurándonos de no modificar el id
    const updatedProduct = {
      id: productToUpdate.id, // Mantener el mismo id
      title: title || productToUpdate.title,
      description: description || productToUpdate.description,
      code: code || productToUpdate.code,
      price: price || productToUpdate.price,
      status: status || productToUpdate.status,
      stock: stock || productToUpdate.stock,
      category: category || productToUpdate.category,
      thumbnails: thumbnails || productToUpdate.thumbnails,
    }

    // Reemplazar el producto actualizado en el arreglo
    products[productIndex] = updatedProduct

    // Guardar los productos actualizados en el archivo
    const productsStringified = JSON.stringify(products, null, '\t')
    await fs.promises.writeFile(pathToProducts, productsStringified)

    // Enviar respuesta con el producto actualizado
    res.send({ message: 'Producto actualizado', data: updatedProduct })
  } catch (error) {
    res.status(500).send({ message: 'Error al actualizar el producto', error })
  }
})