
module.exports = {
  production: {
    // Search for the correct locale. Use the fallback url if not found.
    'en-US': 'https://carecru.io',
    fallback: 'https://carecru.ca',
  },
  development: { fallback: 'http://localhost:5000' },
};
