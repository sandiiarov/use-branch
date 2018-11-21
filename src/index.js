import warning from 'warning';

export default () => {
  warning(
    process.env.NODE_ENV === 'production',
    'You likely forgot to add "use-branch/babel" to your babel config'
  );
};
