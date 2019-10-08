import $ from 'jquery';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template,
    isUndefined as _isUndefined,
    isNull as _isNull
} from 'lodash';
import { shapes, util } from 'jointjs';
import SimpleRow from '../simple-row/simple-row';
import ObjectRowTemplate from './object-row.html';

if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const ObjectRow = shapes.html.ObjectRow = {};

ObjectRow.Element = SimpleRow.Element.extend({
    defaults: util.deepSupplement({
        type: 'html.ObjectRow.Element',
    }, SimpleRow.Element.prototype.defaults)
});

ObjectRow.ElementView = SimpleRow.ElementView.extend({
    initTemplate: function () {
        this.$box = $(_template(ObjectRowTemplate)());    
    },

    appendValuesToTemplate: function () {
        const customAttrs = this.model.get("customAttrs");
        for (var a in customAttrs) {
            this.$box.find('div.' + a + '> span').text(customAttrs[a]);
        }
    }
});

export default ObjectRow;