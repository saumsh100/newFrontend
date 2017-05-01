
import { configure } from '@kadira/storybook';
import '../client/apps/default';
import './fonts.css';

const req = require.context('../client/components/library', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
