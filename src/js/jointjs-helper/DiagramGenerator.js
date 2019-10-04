import { createCoupled, createTitleRow, createSimpleRow } from './JointJsHelper';
import { concat, forEach, includes, map } from 'lodash';

const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": "Book",
    "properties": {
        "id":     { "type": "string" },
        "title":  { "type": "string" },
        "author": { "type": "string" },
        "year":   { "type": "integer" },
        "publisher": { "type": "string" },
        "website":   { "type": "string" }
    },
    "required": ["id", "title", "author", "year", "publisher"]
};

const TYPE = "type";
const WIDTH = 400;
const HEIGHT = 35;
const HEIGHT_OFFSET = 35;
const X_START = 700;
const Y_START = 380;

const props = schema.properties || {};
const requiredProps = schema.required || [];
const propKeys = Object.keys(props);

const diagramRoot = createCoupled({ text: 'Book', x: X_START, y: Y_START, width: WIDTH, height: (HEIGHT * propKeys.length) });
const titleRow = createTitleRow({title: 'Book',x: X_START, y: Y_START,width: WIDTH, height: HEIGHT});

let cells = { root: null, child: [] };
cells.root = diagramRoot;
cells.child.push(titleRow);

const simpleRows = map(propKeys, (value, index) => createSimpleRow({
    field_name: value,
    field_constraints: (includes(requiredProps, value)) ? "req" : "opt",
    field_date_type: props[value][TYPE] || "null",
    width: WIDTH, height: HEIGHT,
    x: X_START,
    y: Y_START + (index * HEIGHT_OFFSET),
}));

cells.child = concat(cells.child, simpleRows);

forEach(cells.child, (item) => {
    cells.root.embed(item);
});

export default cells;