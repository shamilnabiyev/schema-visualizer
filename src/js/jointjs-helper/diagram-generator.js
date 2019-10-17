import {createCoupled, createTitleRow, createSimpleRow, PORT_OPTIONS} from './jointjs-helper';
import {
    isEqual as _isEqual,
    isUndefined as _isUndefined,
    forEach as _forEach,
    includes as _includes,
    toLower as _toLower,
    has as _has,
    filter as _filter,
    map as _map,
    noop as _noop,
    pickBy as _pickBy,
    concat as _concat
} from 'lodash';
import traverse from 'json-schema-traverse';
import {dereference} from "@jdw/jst";
import ObjectRow from "../schema-diagram/object-row/object-row";

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
        }
    },
    "required": ["id", "title", "author", "year", "publisher", "subDoc"]
};

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

const TYPE = "type";
const WIDTH = 400;
const HEIGHT = 35;
const HEIGHT_OFFSET = 35;
const X_START = 700;
const Y_START = 380;
const REQ_FRAG = "req";
const OPT_FLAG = " ";
const NULL_TYPE = "null";

const props = schema.properties || {};
const propKeys = Object.keys(props);
const requiredProps = schema.required || [];

const diagramTitle = "Book";

const diagramRoot = createCoupled({
    text: diagramTitle,
    x: X_START,
    y: Y_START,
    // width: WIDTH,
    // height: (HEIGHT * (propKeys.length + 1))
});
const titleRow = createTitleRow({title: diagramTitle, x: X_START, y: Y_START, width: WIDTH, height: HEIGHT});

const cells = {rootCell: diagramRoot, childCells: [titleRow]};

/**
 *
 * @param value
 * @param index
 * @returns {*}
 */
/*
const simpleRow = (value, index) => createSimpleRow({
    field_name: value,
    field_constraints: (_includes(requiredProps, value)) ? REQ_FRAG : OPT_FLAG,
    field_date_type: props[value][TYPE] || NULL_TYPE,
    width: WIDTH, height: HEIGHT,
    x: X_START,
    y: Y_START + ((index + 1) * HEIGHT_OFFSET),
});
*/

/**
 *
 * @param {String} key The json schema property name
 * @param {Object} value The property itself containing key value pairs such as data type, properties etc.
 */
const simpleRow = (value, key) => createSimpleRow({
    field_name: key,
    field_constraints: (_includes(requiredProps, key)) ? REQ_FRAG : OPT_FLAG,
    field_date_type: value[TYPE],
    width: WIDTH, height: HEIGHT,
    x: X_START,
});

function createObjectRow(options) {
    return new ObjectRow.Element({
        isObjectRow: true,
        customAttrs: {
            field_name: options.field_name,
            field_constraints: options.field_constraints || 'ID, req, unq, idx',
            field_date_type: options.field_date_type || 'obj'
        },
        size: {width: options.width || 0, height: options.height || 0},
        position: {x: options.x || 0, y: options.y || 0},
        rowLevel: options.rowLevel || 0,
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });
}

const objectRow = (value, key) => createObjectRow({
    field_name: key,
    field_constraints: (_includes(requiredProps, key)) ? REQ_FRAG : OPT_FLAG,
    field_date_type: value[TYPE],
    width: WIDTH, height: HEIGHT,
    x: X_START,
});

// const simpleRowList = propKeys.map((value, index) => simpleRow(value, index));
// cells.child = cells.child.concat(simpleRowList);
// console.log('jst.dereference', dereference(complexSchema) );

const SIMPLE_TYPES = ["boolean", "integer", "null", "number", "string"];
const OBJECT_TYPE = "object";
const ARRAY_TYPE = "array";
const MULTI_TYPE = 'multi';
const ANY_OF = 'anyOf';

const initialDoc = {simpleRowList: [], objectRowList: [], arrayRows: []};
// generateRow(schema.properties, initialDoc, requiredProps);

function generateRow(properties, doc, required) {
    _forEach(properties,  (property, key) => {
        if (_includes(SIMPLE_TYPES, property.type)) {
            addSimpleRow(property, doc, key, required);
        }
        if (_isEqual(property.type, OBJECT_TYPE)) {
            addDocumentRow(property, doc, key, required);
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

function getConstraints(property, key, required) {
    if (_isUndefined(required)) {
        return (_has(property, "constraints")) ? property["constraints"] : undefined;
    }

    let constraints = [];
    (_includes(required, key)) ? constraints.push("req") : constraints.push("opt");
    return constraints;
}

function addSimpleRow(property, doc, key, required) {
    doc.simpleRowList.push(simpleRow(property, key));
}

function addDocumentRow(property, doc, key, required) {
    const subDoc = objectRow(property, key);
    doc.objectRowList.push(subDoc);
    generateRow(property.properties, subDoc);
}

// cells.childCells = cells.childCells.concat(initialDoc.simpleRowList);

/*
_forEach(cells.child, (element, index) => {
    element.prop('position/y', (index * HEIGHT_OFFSET), {parentRelative: true});
    cells.root.embed(element);
});
*/

const isSimpleType = (property) => _isUndefined(property.type) ? false : _includes(SIMPLE_TYPES, property.type);
const isObjectType = (property) => _isUndefined(property.type) ? false : _includes(OBJECT_TYPE, property.type);

const simpleTypeProps = _pickBy(schema.properties, (property, key) => isSimpleType(property));
const simpleRowList = _map(simpleTypeProps, simpleRow);

const objectTypeProps = _pickBy(schema.properties, (property, key) => isObjectType(property));
const objectRowList = _map(objectTypeProps, (value, key) => objectRow(value, key));

cells.childCells = _concat(cells.childCells, simpleRowList, objectRowList);
// cells.childCells = _concat(cells.childCells, );

export default cells;