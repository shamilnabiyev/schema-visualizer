import _isArray from 'lodash/isArray';
import _isEqual from 'lodash/isEqual';
import _isPlainObject from 'lodash/isPlainObject';
import _includes from 'lodash/includes';
import _isNil from 'lodash/isNil';
import _has from 'lodash/has';
import _forEach from 'lodash/forEach';
import _cloneDeep from 'lodash/cloneDeep';
import $ from "jquery";
import {dia, shapes} from "jointjs";
import {
    createTitleRow, createSimpleRow, createObjectRow, createPaper, createRect
} from './jointjs-helper';
import DiagramRoot from "../schema-diagram/diagram-root/";
import {migCastDbSchemata, movieLensDbSchemata, speciesDbSchemata} from "./schema-examples";
import Supertype from "../schema-diagram/supertype/supertype";

let GRAPH = initGraph();
let PAPER = initPaper();

function initGraph() {
    return new dia.Graph({}, {cellNamespace: shapes});
}

function getGraph() {
    if (_isNil(GRAPH)) GRAPH = initGraph();
    return GRAPH;
}

function initPaper() {
    return createPaper($('#paper-html-elements'), getGraph());
}

export const getPaper = function () {
    if (_isNil(PAPER)) PAPER = initPaper();
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
const ONE_OF = "oneOf";

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

    if (!_has(property, PROPERTIES)) return;
    rowLevel.value += 1;
    generateRows(property[PROPERTIES], subDoc, rowLevel);
    rowLevel.value -= 1;
}

function addArrayRow(doc, key, property, rowLevel) {
    const arrayRow = objectRow(property, key, rowLevel.value);
    doc.addObjectRow(arrayRow);

    if (!_has(property, ITEMS)) return;
    if (_has(property, [ITEMS, ONE_OF])) {
        property[ITEMS] = [...new Set(property[ITEMS][ONE_OF].map(JSON.stringify))].map(JSON.parse);
    }

    rowLevel.value += 1;
    if (_isPlainObject(property[ITEMS]) && !_isArray(property[ITEMS])) {
        addArrayItems(arrayRow, property[ITEMS], '[0]', rowLevel);
    } else if (_isArray(property[ITEMS])) {
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

    const titleText = SCHEMA.title || "Entity_Type_" + Math.floor(X_START / FIFTY);
    if (_isNil(SCHEMA.title)) SCHEMA.title = titleText;

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
    diagramRoot.setSchema(SCHEMA);

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

export const addMigCastDbDiagrams = function () {
    createDiagramRoot(migCastDbSchemata.simulations);
    createDiagramRoot(migCastDbSchemata.results);
    createDiagramRoot(migCastDbSchemata.stats);
};

export const addSpeciesDbDiagrams = function () {
    createDiagramRoot(speciesDbSchemata.species);
    createDiagramRoot(speciesDbSchemata.protocols);
};

export const addMovieLensDbSchemata = function () {
    createDiagramRoot(movieLensDbSchemata.users);
    createDiagramRoot(movieLensDbSchemata.links);
    createDiagramRoot(movieLensDbSchemata.movies);
    createDiagramRoot(movieLensDbSchemata.ratings);
    createDiagramRoot(movieLensDbSchemata.tags);
};

let SERIALIZED_DATA = null;

export const serializeDiagrams = function () {
    SERIALIZED_DATA = GRAPH.toJSON();
    console.log(SERIALIZED_DATA);
};

export const deserializeDiagrams = function () {
    if (_isNil(SERIALIZED_DATA)) {
        alert("No serialized data found");
        return;
    }
    GRAPH.fromJSON(SERIALIZED_DATA);
};

/**
 * TODO: to be removed
 * @deprecated
 */
export const createSupertype = function () {
    const person = new Supertype.Element({
        position: {x: 200, y: 200}
    });
    GRAPH.addCell(person);

    const diagramTitle = createTitleRow({
        title: "Student",
        width: WIDTH,
        height: HEIGHT
    });
    GRAPH.addCell(diagramTitle);

    const student = new DiagramRoot.Element({
        attrs: {text: {text: "Student"}},
    });
    GRAPH.addCell(student);


    student.position(50, 50, {parentRelative: true});
    // student.setDiagramTitle(diagramTitle);

    student.embed(diagramTitle);
    diagramTitle.position(0, 0, {parentRelative: true});

    const firstName = simpleRow({"type": "integer"}, "first_name", {value: 0});
    GRAPH.addCell(firstName);

    student.embed(firstName);
    firstName.position(0, 35, {parentRelative: true});

    student.fitEmbeds();
    student.toFront();

    person.embed(student);
    // person.position(100, 100);

    // student.position(50, 50, {parentRelative: true});

    person.fitEmbeds({
        padding: {
            top: 50,
            left: 50,
            right: 50,
            bottom: 50
        }
    });
    // person.toFront();
};