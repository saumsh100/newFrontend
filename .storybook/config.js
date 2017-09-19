import { configure } from '@storybook/react';
import 'babel-polyfill';
import './fonts.css';
//import '../client/ui.scss'

const req = require.context('../stories', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
