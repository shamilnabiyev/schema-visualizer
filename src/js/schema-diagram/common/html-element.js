import $ from 'jquery';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template,
    isUndefined as _isUndefined,
    isNull as _isNull
} from 'lodash';
import { dia, shapes, util } from 'jointjs';
import {renderBox, updateBox, removeBox, initializeBox, appendValuesToTemplate} from '../utils';

if (_isUndefined(shapes.html)) {
    shapes.html = {};
}

const CustomHtml = shapes.html;

CustomHtml.Element = shapes.devs.Model.extend({
    defaults: util.defaultsDeep({
        type: 'html.Element',
        attrs: {
            '.body': { stroke: '#ffffff' }
        }
    }, shapes.devs.Model.prototype.defaults),
    rowLevel: 0
});

CustomHtml.ElementView = dia.ElementView.extend({
    htmlTemplate: '',

    initialize: initializeBox,

    addAdditionalEvents: function() {

    },

    appendValuesToTemplate: appendValuesToTemplate,

    render: renderBox,
    updateBox: updateBox,
    removeBox: removeBox
});

export default CustomHtml;