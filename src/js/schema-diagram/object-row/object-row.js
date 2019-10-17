import {
    concat as _concat,
    findIndex as _findIndex,
    isUndefined as _isUndefined
} from 'lodash';
import {shapes, util} from 'jointjs';
import CustomHtml from '../common/html-element';
import ObjectRowTemplate from './object-row.html';


if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const HEIGHT = 35;
const TRANSITION_DELAY = 0;
const TRANSITION_DURATION = 100;

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

    objectRowList: [],

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
        const view = this;
        if(_isUndefined(view)) return;

        removeAllSimpleRows(view);

        let parentCell =  view.model.getParentCell();

        const rowExpander = view.$box.find('.row-expander');
        if (_isUndefined(rowExpander)) return;

        const caretRight = view.$box.find('.fa-caret-right');
        if (_isUndefined(caretRight)) return;

        rowExpander.on('click', (evt) => {
            /* workaround to get the parent cell */
            parentCell = parentCell || view.model.getParentCell();

            caretRight.toggleClass('down');

            if (view.isCollapsed) {
                expandRow(view, parentCell);
            } else if (!view.isCollapsed) {
                collapseRow(view, parentCell);
            }
        });
    }
});

function expandRow(view, parentCell) {

    if(_isUndefined(view)) return;
    if(_isUndefined(parentCell)) return;

    const parentHeight = parentCell.prop("size/height");

    let offset = HEIGHT * view.simpleRowListLength();
    if(offset === 0) return;

    parentCell.transition("size/height", parentHeight + offset, {
        delay: TRANSITION_DELAY,
        duration: TRANSITION_DURATION
    });

    const slicedEmbeds = sliceEmbeds(view.model, parentCell);
    slicedEmbeds.forEach((cell) => {
        let cellPositionY = cell.prop("position/y");
        cell.transition("position/y", cellPositionY + offset, {
            delay: TRANSITION_DELAY,
            duration: TRANSITION_DURATION
        });
    });

    const modelPosition = view.model.get('position');
    offset = 0;
    view.model.simpleRowList.forEach((simpleRow, index) => {
        offset = HEIGHT * (index + 1);
        simpleRow.position(modelPosition.x, modelPosition.y + offset);
        view.model.graph.addCell(simpleRow);
        parentCell.embed(simpleRow);
    });
    view.isCollapsed = false;
}

function collapseRow(view, parentCell) {
    if(_isUndefined(view)) return;
    if(_isUndefined(parentCell)) return;

    const parentHeight = parentCell.prop("size/height");
    if (parentHeight <= HEIGHT) return;

    removeAllSimpleRows(view);

    let offset = HEIGHT * view.simpleRowListLength();
    if(offset === 0) return;

    parentCell.transition("size/height", parentHeight - offset, {
        delay: TRANSITION_DELAY,
        duration: TRANSITION_DURATION
    });

    const slicedEmbeds = sliceEmbeds(view.model, parentCell);
    slicedEmbeds.forEach((cell) => {
        let cellPositionY = cell.prop("position/y");
        cell.transition("position/y", cellPositionY - offset, {
            delay: TRANSITION_DELAY,
            duration: TRANSITION_DURATION
        });
    });

    view.isCollapsed = true;
}

function removeAllSimpleRows(view) {
    const graph = view.model.graph;
    graph.removeCells(view.model.simpleRowList);
}

function sliceEmbeds(model, parentCell) {
    if(_isUndefined(model) || _isUndefined(parentCell)) return [];

    let embeddedCells = parentCell.getEmbeddedCells();
    embeddedCells = embeddedCells.filter((cell) => _isUndefined(cell.prop("rowLevel")) || cell.prop("rowLevel") < model.prop("rowLevel"));
    const modelCellIndex = _findIndex(embeddedCells, (cell) => cell.get("id") === model.get("id"));
    const slicedCells = embeddedCells.slice(modelCellIndex + 1);
    return slicedCells;
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
