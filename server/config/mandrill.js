
import globals from './globals';
import mandrill from 'mandrill-api/mandrill';

export default new mandrill.Mandrill(globals.mandrill.apiKey);
