const graphviz = require('graphviz');

const buildDotFile = ({ nodes, edges }) => {
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

module.exports = {
  buildDotFile,
};
