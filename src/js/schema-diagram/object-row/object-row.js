import _findIndex from 'lodash/findIndex';
import _isUndefined from 'lodash/isUndefined';
import _forEach from 'lodash/forEach';
import {shapes, util} from 'jointjs';
import HierarchyBase from "../common/hierarchy-base-view";
import {appendValuesToTemplate} from "../utils";
import SimpleRow from "../simple-row/simple-row";


if (_isUndefined(shapes.html)) {
    throw Error("joint.shapes.html is not undefined");
}

const HEIGHT = 35;
const TRANSITION_DELAY = 0;
const TRANSITION_DURATION = 100;

const ObjectRow = shapes.html.ObjectRow = {};

/**
 * typedef {HierarchyBase.Element} ObjectRow.Element
 */


ObjectRow.Element = HierarchyBase.Element.extend((function () {
    /**
     * Model defaults
     */
    const defaults = util.defaultsDeep({
        type: 'html.ObjectRow.Element',
    }, HierarchyBase.Element.prototype.defaults);

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

    /**
     *
     * @param {SimpleRow.Element} header
     */
    const setHeader = function (header) {
      if(_isUndefined(this.get('objectRowHeader'))) this.prop('objectRowHeader', header);
    };

    const getHeader = function () {
        return (_isUndefined(this.get('objectRowHeader'))) ? new SimpleRow.Element() : this.get('objectRowHeader');
    };

    const isCollapsed = function () {
        if (_isUndefined(this.get('isCollapsed'))) this.prop('isCollapsed', true);
        return this.get('isCollapsed');
    };

    const setCollapsed = function () {
        this.prop('isCollapsed', true);
    };

    const setExpanded = function() {
        this.prop('isCollapsed', false);
    };

    return {
        defaults: defaults,
        rowLevel: rowLevel,
        setHeader: setHeader,
        getHeader: getHeader,
        isCollapsed: isCollapsed,
        setCollapsed: setCollapsed,
        setExpanded: setExpanded,
    };
})());

ObjectRow.ElementView = HierarchyBase.ElementView.extend({
    // htmlTemplate: ObjectRowTemplate,
    isCollapsed: true,

    appendValuesToTemplate: appendValuesToTemplate,

    addAdditionalEvents_tmp: function () {
        const view = this;
        if (_isUndefined(view)) return;

        removeAllSimpleRows(view);

        let parentCell = view.model.getParentCell();



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
