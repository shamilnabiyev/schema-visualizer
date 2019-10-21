import { isUndefined as _isUndefined } from 'lodash';
import { shapes, util } from 'jointjs';
import CustomHtml from '../common/html-element';
import ObjectRowHeaderTemplate from './object-row-header.html';
import {appendValuesToTemplate} from "../utils";

if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const ObjectRowHeader = shapes.html.ObjectRowHeader = {};

ObjectRowHeader.Element = CustomHtml.Element.extend({
    defaults: util.defaultsDeep({
        type: 'html.ObjectRowHeader.Element',
    }, CustomHtml.Element.prototype.defaults)
});

ObjectRowHeader.ElementView = CustomHtml.ElementView.extend({
    htmlTemplate: ObjectRowHeaderTemplate,

    appendValuesToTemplate: appendValuesToTemplate,

    addAdditionalEvents: function () {
        const view = this;

        const rowExpander = view.$box.find('.row-expander');
        if (_isUndefined(rowExpander)) return;

        const caretRight = view.$box.find('.fa-caret-right');
        if (_isUndefined(caretRight)) return;

        rowExpander.on('click', (evt) => {
            caretRight.toggleClass('down');
        });
    }
});

export default ObjectRowHeader;
