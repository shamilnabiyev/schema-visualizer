import _isUndefined from 'lodash/isUndefined';
import { dia, shapes, util } from 'jointjs';
import {renderBox, updateBox, removeBox, initializeBox, appendValuesToTemplate} from '../utils';

if (_isUndefined(shapes.html)) {
    shapes.html = {};
}

const CustomHtml = shapes.html;

CustomHtml.Element = shapes.devs.Atomic.extend({
    defaults: util.defaultsDeep({
        type: 'html.Element',
        attrs: {
            '.body': { stroke: '#ffffff' }
        }
    }, shapes.devs.Atomic.prototype.defaults),
    rowLevel: 0
});

CustomHtml.ElementView = dia.ElementView.extend({
    htmlTemplate: '',
    initialize: initializeBox,
    addAdditionalEvents: function() {},
    appendValuesToTemplate: appendValuesToTemplate,
    render: renderBox,
    updateBox: updateBox,
    removeBox: removeBox
});

export default CustomHtml;