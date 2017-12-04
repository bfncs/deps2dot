const graphviz = require('graphviz');
const findPackageJsonFiles = require("./findPackageJsonFiles");
const { compose, flatMap } = require("./utils");

const defaultIgnoreDirs = ["node_modules"];

const buildDependencyMap = packageJsonFilePaths =>
  packageJsonFilePaths
    .map(require)
    .reduce(
      (acc, { name, dependencies = {} }) => ({
        ...acc,
        [name]: Object.keys(dependencies)
      }),
      {}
    );

const buildGraph = dependencyMap => {
  const nodes = Object.keys(dependencyMap);
  const edges = flatMap(
    ([ node, dependencies ]) =>
      dependencies
        .filter(d => nodes.includes(d))
        .map(d => [node, d]),
    Object.entries(dependencyMap)
  );
  return { nodes, edges };
};

const buildGraphViz = ({ nodes, edges }) => {
  const g = graphviz.digraph("G");

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

const deps2dot = (path, { ignoreDirs = defaultIgnoreDirs } = {}) =>
  findPackageJsonFiles(path, ignoreDirs)
    .then(compose(buildGraphViz, buildGraph, buildDependencyMap));

module.exports = deps2dot;
