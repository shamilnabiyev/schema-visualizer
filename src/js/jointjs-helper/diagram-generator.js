import {createTitleRow, createSimpleRow, createObjectRow} from './jointjs-helper';
import {
    isArray as _isArray,
    isEqual as _isEqual,
    isPlainObject as _isPlainObject,
    includes as _includes,
    has as _has,
    forEach as _forEach,
} from 'lodash';
import {Generator as SchemaGenerator} from "json-s-generator";
import DiagramRoot from "../schema-diagram/diagram-root/diagram-root";
import {schema, schema2, foxx_manifest, simulations} from './schema-examples';

const SCHEMA = schema2;

let GRAPH = null;
const TYPE = "type";
const WIDTH = 400;
const HEIGHT = 35;
// const HEIGHT_OFFSET = 35;
const X_START = 50;
const Y_START = 50;
const REQ_FRAG = "req";
const OPT_FLAG = " ";
// const NULL_TYPE = "null";

// const props = schema.properties || {};
// const propKeys = Object.keys(props);
const requiredProps = SCHEMA.required || [];

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
// const MULTI_TYPE = 'multi';
// const ANY_OF = 'anyOf';
const ITEMS = "items";

function generateRow(properties, doc, rowLevel) {
    _forEach(properties, (property, key) => {
        if (_includes(SIMPLE_TYPES, property.type)) {
            addSimpleRow(doc, key, property, rowLevel);
        }
        if (_isEqual(property.type, OBJECT_TYPE)) {
            addDocumentRow(doc, key, property, rowLevel);
        }

        if (_isEqual(property.type, ARRAY_TYPE)) {
            addArrayRow(doc, key, property, rowLevel);
        }
        /*
        if (_isEqual(property.type, MULTI_TYPE)) {
            addMultiTypeRow(property, doc, key);
        }
       */
    });
}

function addSimpleRow(doc, key, property, rowLevel) {
    const newSimpleRow = simpleRow(property, key, rowLevel.value);
    doc.addSimpleRow(newSimpleRow);
}

function addDocumentRow(doc, key, property, rowLevel) {
    const subDoc = objectRow(property, key, rowLevel.value);
    doc.addObjectRow(subDoc);

    rowLevel.value += 1;
    generateRow(property.properties, subDoc, rowLevel);
    rowLevel.value -= 1;
}

function addArrayRow(doc, key, property, rowLevel) {
    const arrayRow = objectRow(property, key, rowLevel.value);
    doc.addObjectRow(arrayRow);

    rowLevel.value += 1;
    if (_has(property, ITEMS) && _isPlainObject(property[ITEMS]) && _isEqual(property[ITEMS].type, OBJECT_TYPE)) {
        addArrayItems(arrayRow, property[ITEMS], '[0]', rowLevel);
    } else if (_has(property, ITEMS) && _isArray(property[ITEMS])) {
        _forEach(property[ITEMS], (elem, elemIndex) => {
            addArrayItems(arrayRow, elem, `[${elemIndex}]`, rowLevel);
        });
    }
    rowLevel.value -= 1;
}

function addArrayItemsList(arrayRow, item, key, rowLevel) {

}

function addArrayItems(arrayRow, items, key, rowLevel) {
    if (_has(items, TYPE) && _isEqual(items[TYPE], OBJECT_TYPE)) {
        const itemsRow = objectRow(items, key, rowLevel.value);
        arrayRow.addObjectRow(itemsRow);

        rowLevel.value += 1;
        generateRow(items.properties, itemsRow, rowLevel);
        rowLevel.value -= 1;
    } else if (_has(items, TYPE) && _includes(SIMPLE_TYPES, items[TYPE])) {
       addSimpleRow(arrayRow, key, items, rowLevel);
    }
}

const generateCells = function (graph) {
    GRAPH = graph;

    const titleText = SCHEMA.title || "TITLE";
    const diagramRoot = new DiagramRoot.Element({
        attrs: {
            text: {text: titleText},
        },
        position: {x: X_START, y: Y_START}
    });
    GRAPH.addCell(diagramRoot);

    const diagramTitle = createTitleRow({
        title: "Book",
        width: WIDTH,
        height: HEIGHT
    });
    GRAPH.addCell(diagramTitle);
    diagramRoot.embed(diagramTitle);
    diagramTitle.position(0, 0, {parentRelative: true});

    diagramRoot.setDiagramTitle(diagramTitle);
    const rowLevel = {value: 0};
    generateRow(SCHEMA.properties, diagramRoot, rowLevel);

    // console.log('embeds: ', diagramRoot.getEmbeddedCells());
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
};

export default generateCells;

/*
const doc = {
    id: "asdasdas",
    num: 123,
    bool: true,
    arr: [false, 1, 2, 3, "4", true],
    obj: {
        sub: 123
    }
};

const generator = new SchemaGenerator();
const mySchema = generator.getSchema(doc);

console.log(mySchema);

 */