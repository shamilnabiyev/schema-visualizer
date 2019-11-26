import _templateSettings from 'lodash/templateSettings';

_templateSettings.interpolate = /\{\{(.+?)\}\}/g;
var tmpl = _.template('<li>{{ name }}</li>');

const names = ["Alice", "Bob", "Dave", "Jane"];

const LiList = names.map(i => tmpl({name: i}));

const ulElem = [].concat("<ul>", LiList, "</ul>").join("");

export default ulElem;