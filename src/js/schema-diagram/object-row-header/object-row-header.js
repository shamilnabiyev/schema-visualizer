import {
    isUndefined as _isUndefined,
    isNull as _isNull,
    isNil as _isNil,
    isFunction as _isFunction,
    has as _has,
    forEach as _forEach,
} from 'lodash';
import {shapes, util} from 'jointjs';
import CustomHtml from '../common/html-element';
import ObjectRowHeaderTemplate from './object-row-header.html';
import {appendValuesToTemplate} from "../utils";
import ObjectRow from "../object-row/object-row";
import DiagramRoot from "../diagram-root";

const HEIGHT = 35;

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
    isCollapsed: true,

    htmlTemplate: ObjectRowHeaderTemplate,

    appendValuesToTemplate: appendValuesToTemplate,

    addAdditionalEvents: function () {
        if (_isUndefined(this)) return;
        if (!_has(this, 'model')) return;
        if (!_has(this, 'model.graph')) return;
        if (!_has(this, '$box')) return;

        const view = this;
        const model = view.model;
        const graph = view.model.graph;
        const $box = view.$box;
        let parentCell;

        const rowExpander = $box.find('.row-expander');
        if (_isUndefined(rowExpander)) return;

        const caretRight = $box.find('.fa-caret-right');
        if (_isUndefined(caretRight)) return;

        rowExpander.on('click', (evt) => {
            if (_isNil(parentCell)) parentCell = model.getParentCell();
            caretRight.toggleClass('down');

            if (parentCell.isCollapsed()) {
                expandParentRow(parentCell);
            } else if (!parentCell.isCollapsed()) {
                collapseParentRow(model, parentCell);
            }
        });
    }
});

function expandParentRow(cell) {
    if (_isNil(cell)) return;
    if (!_has(cell, 'graph')) return;
    if (!_isFunction(cell.getParentCell)) return;

    moveSimpleRows(cell);
    moveObjectRows(cell);

    adjustCell(cell);

    cell.setExpanded();
}

function collapseParentRow(cell, parentCell) {
    const deepEmbeds = parentCell.getEmbeddedCells({deep: true}).filter((item) => item !== cell);
    _forEach(deepEmbeds, (cell) => {if (cell instanceof ObjectRow.Element) { cell.setCollapsed();}});

    parentCell.graph.removeCells(deepEmbeds);
    parentCell.fitEmbeds();
    parentCell.setCollapsed();
    adjustCell(parentCell);
}

/**
 *
 * @param cell JointJs Element
 */
function adjustCell(cell) {
    const parentCell = cell.getParentCell();
    const objectRowList = parentCell.getObjectRowList();

    let cellPosition = objectRowList[0].prop("position");
    let cellHeight = objectRowList[0].prop("size/height");
    let nextPositionY = cellPosition.y + cellHeight;

    _forEach(objectRowList.slice(1), (objectRow, index) => {
        objectRow.position(cellPosition.x, nextPositionY, {deep: true});
        nextPositionY = nextPositionY + objectRow.prop("size/height");
    });

    parentCell.fitEmbeds();

    if(parentCell instanceof DiagramRoot.Element) return;
    adjustCell(parentCell);
}

/**
 *
 * @param cell JointJs Element
 */
function moveSimpleRows(cell) {
    if (_isNil(cell)) return;
    if (_isNil(cell.getSimpleRowList)) return;
    if (_isNil(cell.fitEmbeds)) return;

    const graph = cell.graph;
    const modelHeight = cell.prop('size/height');

    _forEach(cell.getSimpleRowList(), (simpleRow, index) => {
        graph.addCell(simpleRow);
        cell.embed(simpleRow);
        simpleRow.position(0, modelHeight + (index * HEIGHT), {parentRelative: true});
    });
    cell.fitEmbeds();
}

/**
 *
 * @param cell JointJs Element
 */
function moveObjectRows(cell) {
    if (_isNil(cell)) return;
    if (_isNil(cell.getObjectRowList)) return;
    if (_isNil(cell.fitEmbeds)) return;

    const graph = cell.graph;
    const modelHeight = cell.prop('size/height');

    _forEach(cell.getObjectRowList(), (objectRow, index) => {
        const header = objectRow.getHeader();
        graph.addCell(header);
        objectRow.embed(header);

        graph.addCell(objectRow);
        cell.embed(objectRow);

        objectRow.position(0, modelHeight + (index * HEIGHT), {parentRelative: true});
        header.position(0, 0, {parentRelative: true});

        objectRow.fitEmbeds();
    });

    cell.fitEmbeds();
}

export default ObjectRowHeader;
