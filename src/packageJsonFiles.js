const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { flatten } = require('./utils');

const stat = promisify(fs.stat);
const readDir = promisify(fs.readdir);

const findPackageJsonFiles = (dir, ignoreDirs = []) =>
  readDir(dir).then(files =>
    Promise.all(
      files.map(fileName => {
        const filePath = path.resolve(dir, fileName);
        return stat(filePath).then(stat => {
          if (stat.isDirectory()) {
            return ignoreDirs.includes(fileName)
              ? []
              : findPackageJsonFiles(filePath, ignoreDirs);
          } else {
            return fileName === 'package.json' ? [filePath] : [];
          }
        });
      })
    ).then(flatten)
  );

const buildDependencyMap = packageJsonFilePaths =>
  packageJsonFilePaths.map(require).reduce(
    (acc, { name, dependencies = {} }) => ({
      ...acc,
      [name]: Object.keys(dependencies),
    }),
    {}
  );

module.exports = {
  findPackageJsonFiles,
  buildDependencyMap,
};
