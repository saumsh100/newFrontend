
export default function ({ search = '', limit = 15, after, order = ['firstName', 'lastName'] }) {
  return {
    limit,
    after,
    order,
    search: JSON.stringify(search),
  };
}
