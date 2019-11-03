import {createTitleRow, createSimpleRow, createObjectRow, createPaper, createRect} from './jointjs-helper';
import {
    isArray as _isArray,
    isEqual as _isEqual,
    isPlainObject as _isPlainObject,
    includes as _includes,
    has as _has,
    forEach as _forEach, isNil,
    cloneDeep as _cloneDeep
} from 'lodash';
import DiagramRoot from "../schema-diagram/diagram-root/diagram-root";
import {dia} from "jointjs";
import $ from "jquery";
import DiagramTitle from "../schema-diagram/diagram-title";

let GRAPH = initGraph();
let PAPER = initPaper();

function initGraph() {
    return new dia.Graph();
}

function getGraph() {
    if (isNil(GRAPH)) GRAPH = initGraph();
    return GRAPH;
}

function initPaper() {
    return createPaper($('#paper-html-elements'), getGraph());
}

export const getPaper = function () {
    if (isNil(PAPER)) PAPER = initPaper();
    return PAPER;
};

const FIFTY = 50;
const TYPE = "type";
const PROPERTIES = 'properties';
const WIDTH = 400;
const HEIGHT = 35;
let X_START = 50;
let Y_START = 50;
const REQ_FRAG = "req";
const OPT_FLAG = " ";
let requiredProps;

/**
 *
 * @param {String} key The json schema property name
 * @param {Object} value The property itself containing key value pairs such as data type, properties etc.
 * @param {{value: number}} rowLevel
 */
const simpleRow = (value, key, rowLevel) => createSimpleRow({
    field_name: key,
    field_constraints: (_includes(requiredProps, key)) ? REQ_FRAG : OPT_FLAG,
    field_date_type: value[TYPE],
    width: WIDTH, height: HEIGHT,
    x: X_START,
    rowLevel: rowLevel
});

const objectRow = (value, key, rowLevel) => createObjectRow({
    field_name: key,
    field_constraints: (_includes(requiredProps, key)) ? REQ_FRAG : OPT_FLAG,
    field_date_type: value[TYPE],
    width: WIDTH, height: HEIGHT,
    x: X_START,
    rowLevel: rowLevel
});

const SIMPLE_TYPES = ["boolean", "integer", "null", "number", "string"];
const OBJECT_TYPE = "object";
const ARRAY_TYPE = "array";
const ITEMS = "items";

function generateRows(properties, doc, rowLevel) {
    _forEach(properties, (property, key) => {
        if (_includes(SIMPLE_TYPES, property.type)) {
            addSimpleRow(doc, key, property, rowLevel);
        } else if (_isEqual(property.type, OBJECT_TYPE)) {
            addDocumentRow(doc, key, property, rowLevel);
        } else if (_isEqual(property.type, ARRAY_TYPE)) {
            addArrayRow(doc, key, property, rowLevel);
        }
    });
}

function addSimpleRow(doc, key, property, rowLevel) {
    const newSimpleRow = simpleRow(property, key, rowLevel.value);
    doc.addSimpleRow(newSimpleRow);
}

function addDocumentRow(doc, key, property, rowLevel) {
    const subDoc = objectRow(property, key, rowLevel.value);
    doc.addObjectRow(subDoc);

    if(!_has(property, PROPERTIES)) return;
    rowLevel.value += 1;
    generateRows(property[PROPERTIES], subDoc, rowLevel);
    rowLevel.value -= 1;
}

function addArrayRow(doc, key, property, rowLevel) {
    const arrayRow = objectRow(property, key, rowLevel.value);
    doc.addObjectRow(arrayRow);

    rowLevel.value += 1;
    if (_has(property, ITEMS) && _isPlainObject(property[ITEMS]) && _includes(SIMPLE_TYPES, property[ITEMS][TYPE])) {
        addArrayItems(arrayRow, property[ITEMS], '[0]', rowLevel);
    } else if (_has(property, ITEMS) && _isArray(property[ITEMS])) {
        _forEach(property[ITEMS], (elem, elemIndex) => {
            addArrayItems(arrayRow, elem, `[${elemIndex}]`, rowLevel);
        });
    }
    rowLevel.value -= 1;
}

function addArrayItems(arrayRow, items, key, rowLevel) {
    if (_has(items, TYPE) && _isEqual(items[TYPE], OBJECT_TYPE)) {
        const itemsRow = objectRow(items, key, rowLevel.value);
        arrayRow.addObjectRow(itemsRow);

        rowLevel.value += 1;
        generateRows(items[PROPERTIES], itemsRow, rowLevel);
        rowLevel.value -= 1;
    } else if (_has(items, TYPE) && _includes(SIMPLE_TYPES, items[TYPE])) {
        addSimpleRow(arrayRow, key, items, rowLevel);
    }
}

function createCellsFrom(diagramRoot, schema) {
    requiredProps = schema['required'] || [];
    const rowLevel = {value: 0};
    generateRows(schema.properties, diagramRoot, rowLevel);

    diagramRoot.fitEmbeds();

    let diagramRootHeight = diagramRoot.prop('size/height');

    _forEach(diagramRoot.getSimpleRowList(), (simpleRow, index) => {
        GRAPH.addCell(simpleRow);
        diagramRoot.embed(simpleRow);
        simpleRow.position(0, diagramRootHeight + (index * HEIGHT), {parentRelative: true});
    });

    diagramRoot.fitEmbeds();

    diagramRootHeight = diagramRoot.prop('size/height');

    _forEach(diagramRoot.getObjectRowList(), (objectRow, index) => {
        const header = objectRow.getHeader();
        GRAPH.addCell(header);
        objectRow.embed(header);

        GRAPH.addCell(objectRow);
        diagramRoot.embed(objectRow);
        objectRow.position(0, diagramRootHeight + (index * HEIGHT), {parentRelative: true});

        header.position(0, 0, {parentRelative: true});
    });

    diagramRoot.fitEmbeds();
    diagramRoot.toFront();
}

export const createDiagramRoot = function (schema) {
    const SCHEMA = _cloneDeep(schema);

    const titleText = SCHEMA.title || "Entity Type " + Math.floor(X_START / FIFTY);
    const diagramRoot = new DiagramRoot.Element({
        attrs: {
            text: {text: titleText},
        },
        position: {x: X_START, y: Y_START}
    });

    X_START = X_START + FIFTY;
    Y_START = Y_START + FIFTY;

    GRAPH.addCell(diagramRoot);

    const diagramTitle = createTitleRow({
        title: titleText,
        width: WIDTH,
        height: HEIGHT
    });
    GRAPH.addCell(diagramTitle);
    diagramRoot.embed(diagramTitle);
    diagramTitle.position(0, 0, {parentRelative: true});
    diagramRoot.setDiagramTitle(diagramTitle);
    diagramRoot.setSchema(schema);

    createCellsFrom(diagramRoot, SCHEMA);
};

export const updateDiagramRoot = function (diagramRoot) {
    const deepEmbeds = diagramRoot.getEmbeddedCells({deep: true});
    GRAPH.removeCells(deepEmbeds);
    diagramRoot.removeChildCells();

    const diagramRootSchema = diagramRoot.getSchema();

    const diagramTitle = createTitleRow({
        title: diagramRootSchema['title'],
        width: WIDTH,
        height: HEIGHT
    });

    GRAPH.addCell(diagramTitle);
    diagramRoot.embed(diagramTitle);
    diagramTitle.position(0, 0, {parentRelative: true});
    diagramRoot.setDiagramTitle(diagramTitle);

    createCellsFrom(diagramRoot, diagramRootSchema);
};

export const addRect = function () {
    const rect = createRect();
    rect.resize(200, 200);

    const child = createRect();
    rect.embed(child);

    GRAPH.addCells([rect, child]);
    // rect.toFront();
};
