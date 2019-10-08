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
        attrs: {
            '.body': { stroke: '#ffffff' }
        }
    }, shapes.devs.Model.prototype.defaults)
});

SimpleRow.ElementView = CustomHtml.ElementView.extend({
    htmlTemplate: SimpleRowTemplate,

    appendValuesToTemplate: function () {
        const customAttrs = this.model.get("customAttrs");
        for (let a in customAttrs) {
            this.$box.find('div.' + a + '> span').text(customAttrs[a]);
        }
    }
});
export default SimpleRow;