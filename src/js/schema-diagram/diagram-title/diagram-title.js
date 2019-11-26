import _isUndefined from 'lodash/isUndefined';
import { shapes, util } from 'jointjs';
import CustomHtml from '../common/html-element';
import DiagramTitleTemplate from './diagram-title.html';

if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const DiagramTitle = shapes.html.DiagramTitle = {};

DiagramTitle.Element = CustomHtml.Element.extend({
    defaults: util.defaultsDeep({
        type: 'html.DiagramTitle.Element',
    }, CustomHtml.Element.prototype.defaults)
});

DiagramTitle.ElementView = CustomHtml.ElementView.extend({
    htmlTemplate: DiagramTitleTemplate,
});

export default DiagramTitle;