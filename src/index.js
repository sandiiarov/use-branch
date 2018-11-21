import warning from 'warning';

export default () => {
  if (process.env.NODE_ENV !== 'production') {
    warning(
      true,
      'You likely forgot to add "use-branch/babel" to your babel config'
    );
  }
};
