import { isUndefined as _isUndefined } from 'lodash';
import { shapes, util } from 'jointjs';
import SimpleRow from '../simple-row/simple-row';
import DiagramTitleTemplate from './diagram-title.html';

if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const DiagramTitle = shapes.html.DiagramTitle = {};

DiagramTitle.Element = SimpleRow.Element.extend({
    defaults: util.defaultsDeep({
        type: 'html.DiagramTitle.Element',
    }, SimpleRow.Element.prototype.defaults)
});

DiagramTitle.ElementView = SimpleRow.ElementView.extend({
    htmlTemplate: DiagramTitleTemplate,

    appendValuesToTemplate: function () {
        const customAttrs = this.model.get("customAttrs");
        for (let a in customAttrs) {
            this.$box.find('div.' + a + '> span').text(customAttrs[a]);
        }
    }
});

export default DiagramTitle;