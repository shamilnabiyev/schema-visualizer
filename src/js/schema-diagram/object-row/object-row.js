import {isUndefined as _isUndefined} from 'lodash';
import {shapes, util} from 'jointjs';
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
    isCollapsed: true,

    htmlTemplate: ObjectRowTemplate,

    addAdditionalEvents: function () {
        console.log('addAdditionalEvents');
        const graph = this.model.graph;
        const parentId = this.model.get('parent');
        const parentCell = graph.getCell(parentId);
        const rowExpander = this.$box.find('.row-expander');

        if (!_isUndefined(rowExpander)) {
            rowExpander.on('click', (evt) => {
                const parentWidth = parentCell.size()["width"];
                const parentHeight = parentCell.size()["height"];

                /**
                 * get all child nodes of the parent
                 */

                /*
                var subtree = [];
                function collectDeepEmbedded(cell) {
                    _.each(cell.getEmbeddedCells(), function(c) {
                        subtree.push(c);
                        collectDeepEmbedded(c);
                    })
                }
                collectDeepEmbedded(myCell);
                */

                if (this.isCollapsed) {
                    parentCell.resize(parentWidth, parentHeight + 35);
                    this.isCollapsed = false;
                } else if (!this.isCollapsed) {
                    parentCell.resize(parentWidth, parentHeight - 35);
                    this.isCollapsed = true;
                }

                /**/
            });
        }
    }
});

export default ObjectRow;