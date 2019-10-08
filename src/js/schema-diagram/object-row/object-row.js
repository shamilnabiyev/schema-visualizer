import { isUndefined as _isUndefined } from 'lodash';
import { shapes, util } from 'jointjs';
import CustomHtml from '../common/html-element';
import ObjectRowTemplate from './object-row.html';

if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const ObjectRow = shapes.html.ObjectRow = {};

ObjectRow.Element = CustomHtml.Element.extend({
    defaults: util.defaultsDeep({
        type: 'html.ObjectRow.Element',
    }, CustomHtml.Element.prototype.defaults)
});

ObjectRow.ElementView = CustomHtml.ElementView.extend({
    htmlTemplate: ObjectRowTemplate,

});

export default ObjectRow;