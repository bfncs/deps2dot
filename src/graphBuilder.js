const { flatMap } = require('./utils');

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

module.exports = createGraphBuilder;
