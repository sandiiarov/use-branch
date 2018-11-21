import { looksLike } from './helper';

const SOURCE = 'use-branch';

export default function(babel) {
  const { types: t, template } = babel;

  const buildLeft = template(`
    const Left = () => COMPONENT;
  `);

  const buildRight = template(`
    const Right = COMPONENT;
  `);

  const buildReturnStatement = template(`
    if(TEST) {
      return React.createElement(Left, null);
    } else {
      return React.createElement(Right, null);
    }
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
          const { argument: CURRENT } = path.container[
            path.container.length - 1
          ];

          const LEFT = buildLeft({ COMPONENT: CURRENT });
          const RIGHT = buildRight({ COMPONENT });

          path.insertBefore(LEFT);
          path.replaceWith(RIGHT);

          path.container[path.container.length - 1] = buildReturnStatement({
            TEST,
          });
        }
      },
    },
  };
}
