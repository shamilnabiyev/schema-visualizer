'use strict';
import $ from 'jquery';
import SimpleRow from '../simple-row/SimpleRow';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template,
    isUndefined as _isUndefined,
    isNull as _isNull
} from 'lodash';
import { dia, shapes, util } from 'jointjs';

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
    appendValuesToTemplate: function () {
        const customAttrs = this.model.get("customAttrs");
        for (var a in customAttrs) {
            this.$box.find('div.' + a + '> span').text(customAttrs[a]);
        }
    }
});

export default ObjectRow;