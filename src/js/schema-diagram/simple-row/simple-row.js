import { shapes, util } from 'jointjs';
import CustomHtml from '../common/html-element';
import SimpleRowTemplate from './simple-row.html';

/**
 * Use the new custom html element tutorial
 * 
 * URL: https://github.com/clientIO/joint/blob/master/demo/shapes/src/html.js
 */

const SimpleRow = CustomHtml.SimpleRow = {};
SimpleRow.Element = shapes.html.Element.extend({
    defaults: util.defaultsDeep({
        type: 'html.SimpleRow.Element',
    }, CustomHtml.Element.prototype.defaults),
});

SimpleRow.ElementView = CustomHtml.ElementView.extend({
    htmlTemplate: SimpleRowTemplate
});

export default SimpleRow;