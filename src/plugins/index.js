// 自动加载除 index.js 之外的所有js文件
const requireAll = requireContext => requireContext.keys().map(requireContext)

const requireContext = require.context('./', false, /^(?!index\.js$).+\.js$/)

requireAll(requireContext)
