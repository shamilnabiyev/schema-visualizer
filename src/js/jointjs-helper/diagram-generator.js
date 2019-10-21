import { createTitleRow, createSimpleRow, createObjectRow} from './jointjs-helper';
import {
    isEqual as _isEqual,
    forEach as _forEach,
    includes as _includes,
} from 'lodash';
import DiagramRoot from "../schema-diagram/diagram-root/diagram-root";

const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": "Book",
    "properties": {
        "id": {"type": "string"},
        "title": {"type": "string"},
        "author": {"type": "string"},
        "year": {"type": "integer"},
        "publisher": {"type": "string"},
        "website": {"type": "string"},
        "subDoc": {
            "type": "object",
            "properties": {
                "internal": {
                    "type": "object",
                    "properties": {
                        "ean": {
                            "type": "integer"
                        },
                        "sn": {
                            "type": "string"
                        },
                        "pm": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "ean"
                    ]
                }
            },
            "required": [
                "internal"
            ]
        },
        "meta_data": {
            "type": "object",
            "properties": {
                "serial_number": {"type": "string"},
                "logs": {"type": "string"},
                "internal": {
                    "type": "object",
                    "properties": {
                        "ean": {
                            "type": "integer"
                        },
                        "sn": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "ean"
                    ]
                }
            },
            "required": ["serial_number"]
        },
    },
    "required": ["id", "title", "author", "year", "publisher", "subDoc"]
};
/*
const complexSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "billing_address": {"$ref": "#/definitions/address"},
        "shipping_address": {"$ref": "#/definitions/address"}
    },
    "definitions": {
        "address": {
            "type": "object",
            "properties": {
                "street_address": {"type": "string"},
                "city": {"type": "string"},
                "state": {"type": "string"}
            },
            "required": ["street_address", "city", "state"]
        }
    },
};
*/
let GRAPH = null;
const TYPE = "type";
const WIDTH = 400;
const HEIGHT = 35;
// const HEIGHT_OFFSET = 35;
const X_START = 700;
const Y_START = 380;
const REQ_FRAG = "req";
const OPT_FLAG = " ";
// const NULL_TYPE = "null";

// const props = schema.properties || {};
// const propKeys = Object.keys(props);
const requiredProps = schema.required || [];

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
// const ARRAY_TYPE = "array";
// const MULTI_TYPE = 'multi';
// const ANY_OF = 'anyOf';

function generateRow(properties, doc, rowLevel) {
    _forEach(properties, (property, key) => {
        if (_includes(SIMPLE_TYPES, property.type)) {
            addSimpleRow(doc, key, property, rowLevel);
        }
        if (_isEqual(property.type, OBJECT_TYPE)) {
            addDocumentRow(doc, key, property, rowLevel);
        }
        /*
        if (_isEqual(property.type, ARRAY_TYPE)) {
            addArrayRow(property, doc, key, required);
        }

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

const generateCells = function (graph) {
    GRAPH = graph;

    const titleText = "Book";
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
    generateRow(schema.properties, diagramRoot, rowLevel);

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

    console.log('diagramRoot.ParentCell: ', diagramRoot.getParentCell());
};

export default generateCells;
