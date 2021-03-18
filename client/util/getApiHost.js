const PRODUCTION_API = `${window.location.protocol.replace(':', '')}://${window.location.host}`;

const apiHost = process.env.API_SERVER || PRODUCTION_API;
export default apiHost;
