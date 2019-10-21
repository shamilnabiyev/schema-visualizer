import {
    isUndefined as _isUndefined,
    isNull as _isNull,
    has as _has,
    forEach as _forEach,
    isNil as _isNil
} from 'lodash';
import {shapes, util} from 'jointjs';
import CustomHtml from '../common/html-element';
import ObjectRowHeaderTemplate from './object-row-header.html';
import {appendValuesToTemplate} from "../utils";
import ObjectRow from "../object-row/object-row";
import DiagramRoot from "../diagram-root";

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
            if (_isUndefined(parentCell) && _isNull(parentCell)) parentCell = model.getParentCell();

            if (view.isCollapsed) {
                expandParentRow(view);
            } else if (!view.isCollapsed) {
                collapseParentRow(view);
            }
            caretRight.toggleClass('down');
        });
    }
});

function expandParentRow(view) {
    if (_isUndefined(view) && _isNull(view)) return;
    if (!_has(view, 'model')) return;
    if (!_has(view, 'model.graph')) return;

    const model = view.model;
    const graph = model.graph;
    const parentCell = model.getParentCell();

    let modelHeight = parentCell.prop('size/height');

    _forEach(parentCell.getSimpleRowList(), (simpleRow, index) => {
        graph.addCell(simpleRow);
        parentCell.embed(simpleRow);
        simpleRow.position(0, modelHeight + (index * 35), {parentRelative: true});
    });

    parentCell.fitEmbeds();
    modelHeight = parentCell.prop('size/height');

    _forEach(parentCell.getObjectRowList(), (objectRow, index) => {
        const header = objectRow.getHeader();
        graph.addCell(header);
        objectRow.embed(header);

        graph.addCell(objectRow);
        parentCell.embed(objectRow);

        objectRow.position(0, modelHeight + (index * 35), {parentRelative: true});
        header.position(0, 0, {parentRelative: true});

        objectRow.fitEmbeds();
    });

    parentCell.fitEmbeds();

    const diagramRoot = getDiagramRoot(parentCell);
    // console.log('diagramRoot: ', diagramRoot);
    moveObjectRows(diagramRoot, parentCell);

    view.isCollapsed = false;
}

function collapseParentRow(view) {
    if (_isUndefined(view) && _isNull(view)) return;
    if (!_has(view, 'model')) return;
    if (!_has(view, 'model.graph')) return;

    const model = view.model;
    const graph = model.graph;
    const parentCell = model.getParentCell();

    removeAllSimpleRows(view);
    removeAllObjectRows(view);

    parentCell.fitEmbeds();

    view.isCollapsed = true;
}

function removeAllSimpleRows(view) {
    view.model.graph.removeCells(view.model.getParentCell().getSimpleRowList());
}

function removeAllObjectRows(view) {
    const graph = view.model.graph;
    const parentCell = view.model.getParentCell();
    const objectRowList = parentCell.getObjectRowList();
    if (_isNil(objectRowList)) return;

    objectRowList.forEach((objectRow) => {
        graph.removeCells([objectRow.getHeader()]);
        objectRow.fitEmbeds();
        removeObjectRow(graph, objectRow);
    });

    graph.removeCells(objectRowList);
}

function removeObjectRow(graph, objectRow) {
    const objectRowList = objectRow.getObjectRowList();
    if (_isNil(objectRowList)) return;

    objectRowList.forEach((row) => {
        graph.removeCells([row.getHeader()]);
        row.fitEmbeds();
        removeObjectRow(graph, row);
    });

    graph.removeCells(objectRow.getSimpleRowList());
    graph.removeCells(objectRow.getObjectRowList());
    objectRow.fitEmbeds();
}

function getDiagramRoot(cell) {
    const result = cell.getParentCell();
    if (result instanceof DiagramRoot.Element) {
        return result;
    } else {
        return getDiagramRoot(result);
    }
}

function moveObjectRows(diagramRoot, parentCell) {
    if (_isNil(diagramRoot) || _isNil(parentCell)) return;
    const objectRowList = diagramRoot.getObjectRowList();

    const indexOfCell = objectRowList.indexOf(parentCell);
    if(_isNil(indexOfCell)) return;

    let cellPositionY = parentCell.prop("position/y");
    let cellHeight = parentCell.prop("size/height");
    let nextPositionY = cellPositionY + cellHeight;

    _forEach(objectRowList.slice(indexOfCell + 1), (objectRow, index) => {
        objectRow.prop("position/y", nextPositionY);
        objectRow.getHeader().prop("position/y", nextPositionY);
        // objectRow.position(0, nextPositionY);
        // objectRow.fitEmbeds();
        nextPositionY = nextPositionY + objectRow.prop("size/height");
    });
}

export default ObjectRowHeader;
