const graphviz = require('graphviz');
const findPackageJsonFiles = require('./findPackageJsonFiles');
const { compose, flatMap } = require('./utils');

const defaultIgnoreDirs = ['node_modules'];

const buildDependencyMap = packageJsonFilePaths =>
  packageJsonFilePaths.map(require).reduce(
    (acc, { name, dependencies = {} }) => ({
      ...acc,
      [name]: Object.keys(dependencies),
    }),
    {}
  );

const findEdges = dependencyMap =>
  flatMap(
    ([node, dependencies]) =>
      dependencies
        .filter(d => Object.keys(dependencyMap).includes(d))
        .map(d => [node, d]),
    Object.entries(dependencyMap)
  );

const buildUsedNodes = edges =>
  edges.reduce(
    (acc, edgeNodes) => [
      ...acc,
      ...edgeNodes.filter(edge => !acc.includes(edge)),
    ],
    []
  );

const createGraphBuilder = (
  includeIndependentNodes = false
) => dependencyMap => ({
  nodes: includeIndependentNodes
    ? Object.keys(dependencyMap)
    : buildUsedNodes(findEdges(dependencyMap)),
  edges: findEdges(dependencyMap),
});

const buildGraphViz = ({ nodes, edges }) => {
  const g = graphviz.digraph('G');

  const graphNodes = nodes.reduce(
    (acc, node) => ({
      ...acc,
      [node]: g.addNode(node),
    }),
    {}
  );

  edges.forEach(([parent, child]) => {
    g.addEdge(graphNodes[parent], graphNodes[child]);
  });

  return g.to_dot();
};

const deps2dot = (
  path,
  { ignoreDirs = defaultIgnoreDirs, includeIndependentNodes = false } = {}
) =>
  findPackageJsonFiles(path, ignoreDirs).then(
    compose(
      buildGraphViz,
      createGraphBuilder(includeIndependentNodes),
      buildDependencyMap
    )
  );

module.exports = deps2dot;
