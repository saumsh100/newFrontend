
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Templates from '../../../client/emailTemplates/templates';

export default function renderTemplates(props) {
  const {
    templateName,
    account,
  } = props;

  const devMode = false;
  const color = devMode || !account.bookingWidgetPrimaryColor ? '#206477' : account.bookingWidgetPrimaryColor;
  const maxWidth = 600;

  const Template = Templates[templateName];

  const templateProps = {
    defaultColor: '#206477',
    color,
    maxWidth,
    title: '',
    devMode,
    lang: 'en',
    ...props,
  };

  let html = renderToStaticMarkup(<Template {...templateProps} />);

  html = html.replace(/&quot;/g, '"');
  html = html.replace(/&lt;/g, '<');
  html = html.replace(/&gt;/g, '>');

  return html;
}

