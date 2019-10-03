import { createCoupled, createTitleRow, createSimpleRow } from './JointJsHelper';

const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "id": {
            "type": "string"
        },
        "title": {
            "type": "string"
        },
        "author": {
            "type": "string"
        },
        "year": {
            "type": "integer"
        },
        "publisher": {
            "type": "string"
        }
    },
    "required": [
        "id",
        "title",
        "author",
        "year",
        "publisher"
    ]
};


const TYPE = "type";
const WIDTH = 400;
const HEIGHT = 35;
const HEIGHT_OFFSET = 35;
const X_START = 700;
const Y_START = 380;



const props = schema.properties;
const keys = Object.keys(props);

const diagramRoot = createCoupled({ text: 'Book', x: X_START, y: Y_START, width: WIDTH, height: (HEIGHT * keys.length)});
const titleRow = createTitleRow({
    title: 'Book',
    x: X_START, y: Y_START,
    width: WIDTH, height: HEIGHT
});

var cells = {root: null, child: []};
cells.root = diagramRoot;
cells.child.push(titleRow);

var child = null;
for(var key in props) {
    // console.log(key, ':', props[key][TYPE]);
    child = createSimpleRow({
        field_name: key,
        field_constraints: "req",
        field_date_type: props[key][TYPE],
        width: WIDTH,
        height: HEIGHT,

    });
}

console.log(keys.map((value, i) => createSimpleRow({
    field_name: value,
    field_constraints: "req",
    field_date_type: props[value][TYPE],
    width: WIDTH,
    height: HEIGHT,

})));