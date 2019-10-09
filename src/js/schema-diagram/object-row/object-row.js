import {
    concat as _concat,
    isUndefined as _isUndefined
} from 'lodash';
import {shapes, util} from 'jointjs';
import CustomHtml from '../common/html-element';
import ObjectRowTemplate from './object-row.html';
import $ from "jquery";

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
        let view = this;
        const parentId = view.model.get('parent');
        const parentCell = view.model.graph.getCell(parentId);

        const rowExpander = view.$box.find('.row-expander');
        if (_isUndefined(rowExpander)) return;
        const graph = view.model.graph;

        rowExpander.on('click', (evt) => {
            $('.fa-caret-right ').toggleClass('down');

            if (view.isCollapsed) {
                expandRow(view, parentCell);
            } else if (!view.isCollapsed) {
                collapseRow(view, parentCell);
            }
        });

        parentCell.on('transition:end', function (element, pathToAttribute) {
            if (view.isCollapsed) {
                const modelPosition = view.model.get('position');
                const child1 = view.model.simpleRowList[0];

                child1.position(modelPosition.x, modelPosition.y + 35);
                graph.addCell(child1);
                view.isCollapsed = false;
            } else if (!view.isCollapsed) {
                // graph.removeCells(view.model.simpleRowList);
                view.isCollapsed = true;
            }
        });
    }
});

function expandRow(view, parentCell) {
    const parentWidth = parentCell.size()["width"];
    const parentHeight = parentCell.size()["height"];

    parentCell.transition("size/height", parentHeight + 35, {
        delay: 0,
        duration: 200
    });
}

function collapseRow(view, parentCell) {
    const graph = view.model.graph;
    const parentWidth = parentCell.size()["width"];
    const parentHeight = parentCell.size()["height"];

    if (parentHeight <= 35) return;
    graph.removeCells(view.model.simpleRowList);

    parentCell.transition("size/height", parentHeight - 35, {
        delay: 0,
        duration: 200
    });

    // view.isCollapsed = true;
}

export default ObjectRow;

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
