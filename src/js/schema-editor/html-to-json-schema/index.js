const himalaya = require('himalaya');
const parse = himalaya.parse;
const parseDefaults = himalaya.parseDefaults;

function removeEmptyNodes(nodes) {
    return nodes.filter(node => {
        if (node.type === 'element') {
            node.children = removeEmptyNodes(node.children);
            return true;
        }
        return node.content.length;
    });
}

function stripWhitespace(nodes) {
    return nodes.map(node => {
        if (node.type === 'element') {
            node.children = stripWhitespace(node.children);
        } else {
            node.content = node.content.trim();
        }
        return node;
    });
}

function removeWhitespace(nodes) {
    return removeEmptyNodes(stripWhitespace(nodes));
}

/**
 * Gets the property name
 *
 * @param {Object} e a JSON-Object representing a DOM-Element
 * @returns the property name
 */
function getPropName(e) {
    if (_.isNil(e)) throw Error("Element is undefined");
    if (!_.has(e, "attributes")) throw Error("attributes is undefined");
    if (!_.isArray(e.attributes)) throw Error("attributes isn't an Array");

    return e.attributes.find(a => a.key === "data-prop-name").value || "";
}

/**
 * Gets the property type
 *
 * @param {Object} e a JSON-Object representing a DOM-Element
 * @returns the property type
 */
function getPropType(e) {
    if (_.isNil(e)) throw Error("Element is undefined");
    if (!_.has(e, "attributes")) throw Error("attributes is undefined");
    if (!_.isArray(e.attributes)) throw Error("attributes isn't an Array");

    return e.attributes.find(a => a.key === "data-prop-type").value || "";
}

/**
 *
 * @param {Object} e a JSON-Object representing a DOM-Element
 * @returns {Object} an object
 */
function extractSimpleRow(e) {
    return {
        [getPropName(e)]: {
            "type": getPropType(e)
        }
    };
}

function extractProperties(e) {
    return parseJsonSchema(e.children.find(c =>
        c.attributes.find(a =>
            a.value === "new-prop-container")).children.find(c =>
        c.attributes.find(a =>
            a.value === "properties")).children.filter(c =>
        c.type === "element"));
}

function extractObjectRow(e) {
    return {
        [getPropName(e)]: {
            "type": getPropType(e),
            "properties": extractProperties(e)
        }
    };
}

function parseJsonSchema(json) {
    return Object.assign({}, ...json.map(node => {
        const propType = getPropType(node);
        if (["string", "number", "integer", "boolean"].indexOf(propType) > -1) return extractSimpleRow(node);
        if (["object", "array"].indexOf(propType) > -1) return extractObjectRow(node);
    }));
}

/*
$('#parser-btn').on('click', function () {
    let result = parse(
        $('#schema-editor > .object-row > .new-prop-container > .properties').html(),
        Object.assign({includePositions: true}, parseDefaults)
    );
    result = removeWhitespace(result).filter(function (i) {
        return i.type === "element";
    });
    console.log({properties: parseJsonSchema(result)});
});
*/

export const htmlToJsonSchema = function (properties) {
    let result = parse(properties, Object.assign({includePositions: true}, parseDefaults));
    result = removeWhitespace(result).filter(function (i) { return i.type === "element";});
    result = {properties: parseJsonSchema(result)};
    return result;
};