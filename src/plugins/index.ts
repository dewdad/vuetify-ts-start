// 自动加载除 index.js 之外的所有js文件
type RequireAllFn = (arg0: any) => any[];
const requireAll: RequireAllFn = (requireContext) => requireContext.keys().map(requireContext);

const requireContext: any = require.context('./', false, /^(?!index\.ts$).+\.ts$/);

requireAll(requireContext);
