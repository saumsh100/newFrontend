
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import db from '../../server/_models/index';

configure({ adapter: new Adapter() });
afterAll(async () => await db.sequelize.close());
