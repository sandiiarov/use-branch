var e = function(n, t) {
    return (
      n &&
      t &&
      Object.keys(t).every(function(r) {
        var a,
          o = t[r],
          c = n[r];
        return 'function' == typeof o
          ? o(c)
          : null == (a = o) || /^[sbn]/.test(typeof a)
          ? o === c
          : e(c, o);
      })
    );
  },
  n = 'use-branch',
  t = 'Branch';
module.exports = function(r) {
  var a = r.template,
    o = a('\n    const ' + t + ' = COMPONENT;\n  '),
    c = a(
      '\n    return TEST ? CURRENT : React.createElement(' + t + ', null);\n  '
    );
  return {
    visitor: {
      Program: {
        enter: function(e, n) {
          n.file.set('USE_BRANCH', null);
        },
      },
      ImportDefaultSpecifier: function(t, r) {
        var a = r.file;
        e(t, { parent: { source: { value: n } } }) &&
          (a.set('USE_BRANCH', t.node.local.name), t.parentPath.remove());
      },
      ExpressionStatement: function(e, n) {
        var t = n.file.get('USE_BRANCH'),
          r = e.node.expression,
          a = r.arguments,
          i = a[0];
        if (r.callee.name === t) {
          var l = o({ COMPONENT: a[1] }),
            u = e.container[e.container.length - 1].argument;
          e.replaceWith(l),
            (e.container[e.container.length - 1] = c({ TEST: i, CURRENT: u }));
        }
      },
    },
  };
};
