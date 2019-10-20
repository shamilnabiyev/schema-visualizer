import {
    concat as _concat,
    findIndex as _findIndex,
    isUndefined as _isUndefined,
    isFunction as _isFunction,
    forEach as _forEach
} from 'lodash';
import {dia, shapes, util} from 'jointjs';
import ObjectRowTemplate from './object-row.html';
import DiagramRoot from "../diagram-root";
import $ from "jquery";
import {removeBox, renderBox, updateBox, initializeBox, appendValuesToTemplate} from "../utils";


if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const HEIGHT = 35;
const TRANSITION_DELAY = 0;
const TRANSITION_DURATION = 100;

const ObjectRow = shapes.html.ObjectRow = {};

ObjectRow.Element = DiagramRoot.Element.extend((function () {
    /**
     * Model defaults
     */
    const defaults = util.defaultsDeep({
        type: 'html.ObjectRow.Element',
    }, DiagramRoot.Element.prototype.defaults);

    let rowLevel = 0;
    /**
     * Sign the undefined value to prevent the inheritance
     * @type {undefined}
     */
    let diagramTitle = undefined;

    /**
     * Sign the undefined value to prevent the inheritance
     * @type {undefined}
     */
    const setDiagramTitle = undefined;

    return {
        defaults: defaults,
        rowLevel: rowLevel,
    };
})());

ObjectRow.ElementView = DiagramRoot.ElementView.extend({
    htmlTemplate: ObjectRowTemplate,
    isCollapsed: true,

    appendValuesToTemplate: appendValuesToTemplate,

    addAdditionalEvents: function () {
        const view = this;
        if (_isUndefined(view)) return;

        removeAllSimpleRows(view);

        let parentCell = view.model.getParentCell();

        const rowExpander = view.$box.find('.row-expander');
        if (_isUndefined(rowExpander)) return;

        const caretRight = view.$box.find('.fa-caret-right');
        if (_isUndefined(caretRight)) return;

        rowExpander.on('click', (evt) => {
            const model = view.model;
            const graph = model.graph;
            let modelHeight = model.prop('size/height');

            // console.log(model.getSimpleRowList());
            /* workaround to get the parent cell */
            parentCell = parentCell || model.getParentCell();

            caretRight.toggleClass('down');

            if (view.isCollapsed) {
                // expandRow(view, parentCell);

                _forEach(model.getSimpleRowList(), (simpleRow, index) => {
                    graph.addCell(simpleRow);
                    model.embed(simpleRow);
                    simpleRow.position(0, modelHeight + (index * 35), {parentRelative: true});
                });

                // model.fitEmbeds();

            } else if (!view.isCollapsed) {
                // collapseRow(view, parentCell);
            }
        });
    },

});

function expandRow(view, parentCell) {

    if (_isUndefined(view)) return;
    if (_isUndefined(parentCell)) return;

    const parentHeight = parentCell.prop("size/height");

    let offset = HEIGHT * (view.model.simpleRowListLength() + view.model.objectRowListLength());
    if (offset === 0) return;

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

    view.model.getSimpleRowList().forEach((simpleRow, index) => {
        offset = HEIGHT * (index + 1);
        simpleRow.position(modelPosition.x, modelPosition.y + offset);
        view.model.graph.addCell(simpleRow);
        parentCell.embed(simpleRow);
    });

    view.model.getObjectRowList().forEach((objectRow, index) => {
        offset = HEIGHT * (index + 1);
        objectRow.position(modelPosition.x, modelPosition.y + offset);
        view.model.graph.addCell(objectRow);
        parentCell.embed(objectRow);
    });

    view.isCollapsed = false;
}

function collapseRow(view, parentCell) {
    if (_isUndefined(view)) return;
    if (_isUndefined(parentCell)) return;

    const parentHeight = parentCell.prop("size/height");
    if (parentHeight <= HEIGHT) return;

    removeAllSimpleRows(view);
    removeAllObjectRows(view);

    let offset = HEIGHT * (view.model.simpleRowListLength() + view.model.objectRowListLength());
    if (offset === 0) return;

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

function removeAllObjectRows(view) {
    const graph = view.model.graph;
    graph.removeCells(view.model.objectRowList);
    view.model.objectRowList.forEach((objectRow) => {
        removeObjectRow(view, objectRow);
    });
}

function removeObjectRow(view, objectRow) {
    const graph = view.model.graph;
    graph.removeCells(objectRow.simpleRowList);
    graph.removeCells(objectRow.objectRowList);

    objectRow.objectRowList.forEach((row) => {
        removeObjectRow(view, row);
    });
}

function sliceEmbeds(model, parentCell) {
    if (_isUndefined(model) || _isUndefined(parentCell)) return [];

    let embeddedCells = parentCell.getEmbeddedCells();
    embeddedCells = embeddedCells.filter((cell) => _isUndefined(cell.prop("rowLevel")) || cell.prop("rowLevel") <= model.prop("rowLevel"));
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
