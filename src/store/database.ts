import { Database } from '@vuex-orm/core'

const requireContext = require.context('../models', false, /.*\.ts$/)
const requireStoreContext = require.context('./storeModules', false, /.*\.ts$/)
const storeModelPaths = requireStoreContext.keys()

const database = new Database()

requireContext.keys().forEach(file => {
  const model = requireContext(file).default
  const storeModelPath = storeModelPaths.find(path => path.includes(model.entity))
  if (storeModelPath) {
    const storeModel = requireStoreContext(storeModelPath).default
    database.register(model, storeModel)
  }
})

export default database
