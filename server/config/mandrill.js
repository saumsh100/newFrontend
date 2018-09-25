
import mandrill from 'mandrill-api/mandrill';
import globals from './globals';

export default new mandrill.Mandrill(globals.mandrill.apiKey, process.env.NODE_ENV);
