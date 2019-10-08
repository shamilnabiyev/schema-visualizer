import { createCoupled, createTitleRow, createSimpleRow } from './jointjs-helper';
import { concat, forEach, includes, map } from 'lodash';

const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": "Book",
    "properties": {
        "id": { "type": "string" },
        "title": { "type": "string" },
        "author": { "type": "string" },
        "year": { "type": "integer" },
        "publisher": { "type": "string" },
        "website": { "type": "string" }
    },
    "required": ["id", "title", "author", "year", "publisher"]
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
const requiredProps = schema.required || [];
const propKeys = Object.keys(props);

const diagramTitle = "Book";

const diagramRoot = createCoupled({ text: diagramTitle, x: X_START, y: Y_START, width: WIDTH, height: (HEIGHT * (propKeys.length + 1)) });
const titleRow = createTitleRow({ title: diagramTitle, x: X_START, y: Y_START, width: WIDTH, height: HEIGHT });

const cells = { root: diagramRoot, child: [titleRow] };

const simpleRow = (value, index) => createSimpleRow({
    field_name: value,
    field_constraints: (includes(requiredProps, value)) ? REQ_FRAG : OPT_FLAG,
    field_date_type: props[value][TYPE] || NULL_TYPE,
    width: WIDTH, height: HEIGHT,
    x: X_START,
    y: Y_START + ((index + 1) * HEIGHT_OFFSET),
});

const simpleRowList = map(propKeys, (value, index) => simpleRow(value, index));

cells.child = concat(cells.child, simpleRowList);

forEach(cells.child, (item) => { cells.root.embed(item); });

export default cells;