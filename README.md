# deps2dot

CLI tool to build Graphviz dot files from package dependencies.

## Install

```bash
yarn global add deps2dot
```

## Use

```bash
# Render dotfile from dependencies in test/fixture
deps2dot test/fixture

# Render to png (depends on Graphviz)
deps2dot test/fixture | dot -Tpng > graph.png

# Render and display (depends on Graphviz & imagemagick)
deps2dot test/fixture | dot | display 
```