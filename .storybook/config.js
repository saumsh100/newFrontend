import { configure } from '@storybook/react';
import 'babel-polyfill';
import './fonts.css';
//import '../client/ui.scss'

const req = require.context('../client/components/library', true, /\.stories\.js$/);
function loadStories() {
  //require('../stories');
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
