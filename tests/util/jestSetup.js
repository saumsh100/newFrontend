import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.setTimeout(1000);
configure({ adapter: new Adapter() });
