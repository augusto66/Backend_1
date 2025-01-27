import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

import { fileURLToPath } from 'url'

// Obtiene la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Rutas a los archivos de productos y carritos
const pathToCarts = path.join(__dirname, '../data/carts.json')
const pathToProducts = path.join(__dirname, '../data/products.json')

// Rutas a los archivos de productos y carritos
// const pathToCarts = path.join(__dirname, '../data/carts.json')
// const pathToProducts = path.join(__dirname, '../data/products.json')

// Función para leer un archivo JSON
const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error(`Error al leer el archivo ${filePath}: ${error.message}`)
  }
};

// Función para escribir en un archivo JSON
const writeFile = async (filePath, data) => {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, '\t'))
  } catch (error) {
    throw new Error(`Error al escribir en el archivo ${filePath}: ${error.message}`)
  }
};

// Clase fsCartManager
const fsCartManager = {
  // Crear un nuevo carrito
  async createCart() {
    try {
      let carts = await readFile(pathToCarts)
      const id = uuidv4()
      const newCart = { id, products: [] }
      carts.push(newCart)
      await writeFile(pathToCarts, carts)
      return newCart
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`)
    }
  },

  // Obtener los productos de un carrito
  async getCartById(cartId) {
    try {
      let carts = await readFile(pathToCarts)
      const cart = carts.find((cart) => cart.id === cartId)
      if (!cart) {
        throw new Error('Carrito no encontrado')
      }
      return cart.products
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`)
    }
  },

  // Agregar un producto al carrito
  async addProductToCart(cartId, productId) {
    try {
      let carts = await readFile(pathToCarts)
      const cart = carts.find((cart) => cart.id === cartId)
      if (!cart) {
        throw new Error('Carrito no encontrado')
      }

      // Verificar si el producto ya está en el carrito
      const productIndex = cart.products.findIndex((product) => product.product === productId)
      
      if (productIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad
        cart.products[productIndex].quantity += 1
      } else {
        // Si no existe, agregar el producto con quantity 1
        cart.products.push({ product: productId, quantity: 1 })
      }

      await writeFile(pathToCarts, carts)
      return cart.products;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`)
    }
  },

  // Verificar si el producto existe
  async productExists(productId) {
    try {
      let products = await readFile(pathToProducts)
      return products.some((product) => product.id === productId)
    } catch (error) {
      throw new Error(`Error al verificar el producto: ${error.message}`)
    }
  }
}

export default fsCartManager