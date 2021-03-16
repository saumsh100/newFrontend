const PRODUCTION_API = `${window.location.protocol}://${window.location.host}`;
export default () => process.env.API_SERVER_HOST || PRODUCTION_API;
