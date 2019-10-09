import {
    concat as _concat,
    isUndefined as _isUndefined
} from 'lodash';
import {shapes, util} from 'jointjs';
import CustomHtml from '../common/html-element';
import ObjectRowTemplate from './object-row.html';

if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const ObjectRow = shapes.html.ObjectRow = {};

ObjectRow.Element = CustomHtml.Element.extend({
    /**
     * Model defaults
     */
    defaults: util.defaultsDeep({
        type: 'html.ObjectRow.Element',
    }, CustomHtml.Element.prototype.defaults),

    /**
     * A list of child elements
     */
    simpleRowList: [],

    /**
     * Adds a new child element to the list 'simpleRowList'
     * @param {Object} simpleRow
     */
    addSimpleRow: function (simpleRow) {
        this.simpleRowList = _concat(this.simpleRowList, simpleRow);
    },

    /**
     * Adds a list of child elements to the list 'simpleRowList'
     * @param {Array} simpleRowList
     */
    addSimpleRows: function (simpleRowList) {
        this.addSimpleRow(simpleRowList);
    }
});

ObjectRow.ElementView = CustomHtml.ElementView.extend({
    htmlTemplate: ObjectRowTemplate,
    isCollapsed: true,

    addAdditionalEvents: function () {
        console.log('addAdditionalEvents');
        const graph = this.model.graph;
        const parentId = this.model.get('parent');
        const parentCell = graph.getCell(parentId);
        const rowExpander = this.$box.find('.row-expander');

        if (!_isUndefined(rowExpander)) {
            rowExpander.on('click', (evt) => {
                toggleCollapse(this, parentCell);
            });
        }
    }
});

/**
 * Toggle the sub cells on mouse click
 * @param view
 * @param parentCell
 */
function toggleCollapse(view, parentCell) {
    console.log('view.model', view.model.simpleRowList);

    const modelPosition = view.model.get('position');
    const child1 = view.model.simpleRowList[0];
    child1.position(modelPosition.x, modelPosition.y + 35);

    const graph = view.model.graph;
    graph.addCell(child1);

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

    if (view.isCollapsed) {
        parentCell.transition("size/height", parentHeight + 35, {
            delay: 0,
            duration: 200
        });
        view.isCollapsed = false;
    } else if (!view.isCollapsed) {
        parentCell.transition("size/height", parentHeight - 35, {
            delay: 0,
            duration: 200
        });
        view.isCollapsed = true;
    }
}

export default ObjectRow;