const compose = (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

const map = (f, arr) => arr.map(f);
const flatten = arr => arr.reduce((x, y) => [...x, ...y], []);
const flatMap = compose(flatten, map);

module.exports = {
  compose,
  flatten,
  flatMap,
};
