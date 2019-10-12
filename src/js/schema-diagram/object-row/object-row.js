import {
    concat as _concat,
    findIndex as _findIndex,
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

    simpleRowListLength: function () {
        return this.model.simpleRowList.length;
    },

    addAdditionalEvents: function () {
        let view = this;
        const graph = view.model.graph;
        const parentId = view.model.get('parent');
        const parentCell = view.model.graph.getCell(parentId);

        const rowExpander = view.$box.find('.row-expander');
        if (_isUndefined(rowExpander)) return;

        const caretRight = view.$box.find('.fa-caret-right');
        if (_isUndefined(caretRight)) return;

        rowExpander.on('click', (evt) => {
            caretRight.toggleClass('down');

            if (view.isCollapsed) {
                expandRow(view, parentCell);
            } else if (!view.isCollapsed) {
                collapseRow(view, parentCell);
            }
        });

        parentCell.on('transition:end', function (element, pathToAttribute) {
            if (view.isCollapsed) {
                const modelPosition = view.model.get('position');
                let offset = 0;
                view.model.simpleRowList.forEach((simpleRow, index) => {
                    offset = 35 * (index + 1);
                    simpleRow.position(modelPosition.x, modelPosition.y + offset);
                    graph.addCell(simpleRow);
                    parentCell.embed(simpleRow);
                });
                // const child1 = view.model.simpleRowList[0];

                // child1.position(modelPosition.x, modelPosition.y + 35);
                // graph.addCell(child1);
                // parentCell.embed(child1);

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

    const offset = 35 * view.simpleRowListLength();

    const embeddedCells = parentCell.getEmbeddedCells();
    const modelCellIndex = _findIndex(embeddedCells, (cell) => cell.get("id") === view.model.get("id"));
    const slicedEmbeds = embeddedCells.slice(modelCellIndex + 1);
    console.log('embeddedCells:', embeddedCells);
    console.log('sliced embeds:', slicedEmbeds);

    parentCell.transition("size/height", parentHeight + offset, {
        delay: 0,
        duration: 150
    });

    slicedEmbeds.forEach((cell) => {
        let cellPosition = cell.get("position");
        cell.transition("position/y", cellPosition.y + offset, {
            delay: 0,
            duration: 150
        });
    });
}

function collapseRow(view, parentCell) {
    const graph = view.model.graph;
    const parentWidth = parentCell.size()["width"];
    const parentHeight = parentCell.size()["height"];

    if (parentHeight <= 35) return;
    graph.removeCells(view.model.simpleRowList);

    let offset = 35 * view.simpleRowListLength();

    const embeddedCells = parentCell.getEmbeddedCells();
    const modelCellIndex = _findIndex(embeddedCells, (cell) => cell.get("id") === view.model.get("id"));
    const slicedEmbeds = embeddedCells.slice(modelCellIndex + 1);
    console.log('embeddedCells:', embeddedCells);
    console.log('sliced embeds:', slicedEmbeds);

    parentCell.transition("size/height", parentHeight - offset, {
        delay: 0,
        duration: 150
    });

    slicedEmbeds.forEach((cell) => {
        let cellPosition = cell.get("position");
        cell.transition("position/y", cellPosition.y - offset, {
            delay: 0,
            duration: 150
        });
    });
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
