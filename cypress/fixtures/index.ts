import { mount, registerApp } from '../../src';

registerApp('nav', '/apps/app_nav.js');

const elememt = document.getElementById('main');
mount(elememt, 'nav');

