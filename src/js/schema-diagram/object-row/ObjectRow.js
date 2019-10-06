import $ from 'jquery';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template,
    isUndefined as _isUndefined,
    isNull as _isNull
} from 'lodash';
import { dia, shapes, util } from 'jointjs';

if(_isUndefined(shapes.html)) {
    console.error("joint.shapes.html is not undefined");
}

const ObjectRow = shapes.html.ObjectRow = {};

ObjectRow.Element = shapes.devs.Model.extend({
    defaults: util.deepSupplement({
        type: 'html.ObjectRow.Element',
        attrs: {
            '.body': { stroke: '#ffffff' }
        }
    }, shapes.devs.Model.prototype.defaults)
});


export default ObjectRow;