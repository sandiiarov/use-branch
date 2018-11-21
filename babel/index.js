const isPrimitive = val => val == null || /^[sbn]/.test(typeof val);

const looksLike = (a, b) =>
  a &&
  b &&
  Object.keys(b).every(bKey => {
    const bVal = b[bKey];
    const aVal = a[bKey];
    if (typeof bVal === 'function') {
      return bVal(aVal);
    }
    return isPrimitive(bVal) ? bVal === aVal : looksLike(aVal, bVal);
  });

const SOURCE = 'use-branch';
const NAME = 'Branch';

export default function(babel) {
  const { types: t, template } = babel;

  const buildBranchComponent = template(`
    const ${NAME} = COMPONENT;
  `);

  const buildReturnStatement = template(`
    return TEST ? CURRENT : React.createElement(${NAME}, null);
  `);

  return {
    visitor: {
      Program: {
        enter(path, { file }) {
          file.set('USE_BRANCH', null);
        },
      },
      ImportDefaultSpecifier(path, { file }) {
        if (looksLike(path, { parent: { source: { value: SOURCE } } })) {
          file.set('USE_BRANCH', path.node.local.name);
          path.parentPath.remove();
        }
      },
      ExpressionStatement(path, { file }) {
        const USE_BRANCH = file.get('USE_BRANCH');
        const {
          callee: { name },
          arguments: [TEST, COMPONENT],
        } = path.node.expression;

        if (name === USE_BRANCH) {
          const BRANCH = buildBranchComponent({ COMPONENT });
          const { argument: CURRENT } = path.container[
            path.container.length - 1
          ];

          path.replaceWith(BRANCH);
          path.container[path.container.length - 1] = buildReturnStatement({
            TEST,
            CURRENT,
          });
        }
      },
    },
  };
}
