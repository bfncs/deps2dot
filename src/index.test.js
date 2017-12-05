const path = require('path');
const deps2dot = require('./index');

describe('fixture integration test', () => {
  const fixturePath = path.resolve(__dirname, '../test/fixture');
  const expectedFixtureResult = `digraph G {
  "minion";
  "canon";
  "pica";
  "paragon";
  "trafalgar";
  "minion" -> "canon";
  "pica" -> "canon";
  "pica" -> "paragon";
  "trafalgar" -> "canon";
  "trafalgar" -> "pica";
}
`;
  it('should convert the fixture directory structure correctly', () => {
    expect.assertions(1);
    return deps2dot(fixturePath).then(actualResult => {
      expect(actualResult).toEqual(expectedFixtureResult);
    });
  });
});
