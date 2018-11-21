# Use Branch "HOOK"

![kapture 2018-11-21 at 13 00 52](https://user-images.githubusercontent.com/15861257/48863510-36c84180-ed8f-11e8-85ca-32cdaec478da.gif)


![npm](https://img.shields.io/npm/dt/use-branch.svg)
![npm](https://img.shields.io/npm/v/use-branch.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/use-branch.svg)
![NpmLicense](https://img.shields.io/npm/l/use-branch.svg)

# Install

### With npm

```sh
npm i use-branch
```

### Or with yarn

```sh
yarn add use-branch
```

# Usage

Add `use-branch/babel` to your `.babelrc`:

```js
// .babelrc
{
  "plugins": ["use-branch/babel"]
}
```

```jsx
import useBranch from 'use-branch';
```

```jsx
const Foo = () => {
  const [token] = useToken();
  useBranch(token, () => <div>Loading...</div>);

  return <div>Token: {token}</div>;
};
```

## use-branch/babel

### Input:

```jsx
const Foo = () => {
  const [token] = useToken();
  useBranch(token, () => <div>Loading...</div>);

  return <div>Token: {token}</div>;
};
```

### Output:

```jsx
const Foo = () => {
  const [token] = useToken();

  const Left = () => <div>Token: {token}</div>;
  const Right = () => <div>Loading...</div>;

  if (token) {
    return React.CreateElement(Left, null);
  } else {
    return React.CreateElement(Right, null);
  }
};
```
