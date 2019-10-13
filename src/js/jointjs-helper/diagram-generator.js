import {createCoupled, createTitleRow, createSimpleRow, createObjectRow} from './jointjs-helper';
import {
    isEqual as _isEqual,
    forEach as _forEach,
    includes as _includes
} from 'lodash';
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
        "meta": {
            "type": "object",
            "properties": {
                "internal": {
                    "type": "object",
                    "properties": {
                        "ean": {
                            "type": "integer"
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
    "required": ["id", "title", "author", "year", "publisher"]
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
    width: WIDTH,
    height: (HEIGHT * (propKeys.length + 1))
});
const titleRow = createTitleRow({title: diagramTitle, x: X_START, y: Y_START, width: WIDTH, height: HEIGHT});

const cells = {root: diagramRoot, child: [titleRow]};

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
const simpleRow = (key, value) => createSimpleRow({
    field_name: key,
    field_constraints: (_includes(requiredProps, key)) ? REQ_FRAG : OPT_FLAG,
    field_date_type: value[TYPE],
    width: WIDTH, height: HEIGHT,
    x: X_START,
});

const objectRow = (value, index) => new createObjectRow({
    field_name: value,
    field_constraints: (_includes(requiredProps, value)) ? REQ_FRAG : OPT_FLAG,
    field_date_type: props[value][TYPE] || NULL_TYPE,
    width: WIDTH, height: HEIGHT,
    x: X_START,
    y: Y_START + ((index + 1) * HEIGHT_OFFSET),
});

// const simpleRowList = propKeys.map((value, index) => simpleRow(value, index));
// cells.child = cells.child.concat(simpleRowList);
// console.log('jst.dereference', dereference(complexSchema) );

const simpleDataTypes = ["boolean", "integer", "null", "number", "string"];

function iterateOverProps(properties) {
    _forEach(properties, (value, key) => {
        if (_includes(simpleDataTypes, value[TYPE])) {
            cells.child = cells.child.concat(simpleRow(key, value));
        }
    });
}

iterateOverProps(schema.properties);

_forEach(cells.child, (element, index) => {
    if(index > 0) element.prop('position/y', (Y_START + (index * HEIGHT_OFFSET)));
    cells.root.embed(element);
});


export default cells;