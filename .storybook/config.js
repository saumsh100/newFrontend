import { configure } from '@storybook/react';
import 'babel-polyfill';
import './fonts.css';
//import '../client/ui.scss'

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
