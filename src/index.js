const {
  findPackageJsonFiles,
  buildDependencyMap,
} = require('./packageJsonFiles');
const { buildDotFile } = require('./graphviz');
const graphBuilder = require('./graphBuilder');
const { compose } = require('./utils');

const defaultIgnoreDirs = ['node_modules'];

const deps2dot = (path, options = {}) => {
  const {
    ignoreDirs = defaultIgnoreDirs,
    includeIndependentNodes = false,
  } = options;
  const processJsonFiles = compose(
    buildDotFile,
    graphBuilder(includeIndependentNodes),
    buildDependencyMap
  );
  return findPackageJsonFiles(path, ignoreDirs).then(processJsonFiles);
};

module.exports = deps2dot;
