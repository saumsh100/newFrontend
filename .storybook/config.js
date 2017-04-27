
import { configure } from '@kadira/storybook';

const req = require.context('../client/components/library', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
