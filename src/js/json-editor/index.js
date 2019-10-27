// create the editor
import JSONEditor from "jsoneditor";
import $ from 'jquery';


const jsonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "anyOf": [
        {"$ref": "#/definitions/object_typ"},
        {"$ref": "#/definitions/array_type"}
    ],
    "definitions": {
        "object_typ": {
            "type": "object",
            "minProperties": 1
        },
        "array_type": {
            "type": "array",
            "items": {"$ref": "#/definitions/object_typ"},
            "minItems": 1,
        }
    }
};

const jsonDocEditor = createJSONEditor(
    document.getElementById("json-doc-editor"),
    {
        mode: 'code',
        search: false,
        statusBar: true,
        enableTransform: false,
        history: true,
        schema: jsonSchema,
        onChange: onChange
    }
);

/**
 *
 * @param {string | Object} err
 */
function onError(err) {
    console.log(err);
}

/**
 * Gets triggered on user interactions with JsonEditor. If the entered json document
 * isn't valid against schema,  * then will be an error thrown and the button 'Visualize'
 * will be disabled
 */
function onChange() {
    try {
        if(!!jsonDocEditor){
            jsonDocEditor.get();
            $('#json-doc-viz-btn').prop("disabled", false);
        }
    } catch (e) {
        $('#json-doc-viz-btn').prop("disabled", true);
    }
}


/**
 * Create a new JSONEditor
 * @param {string | Element} selector  A query selector id like '#myEditor'
 *                                     or a DOM element to use as container
 * @param {Object} [options]
 * @param {Object} [json]
 * @return {JSONEditor} Returns the created JSONEditor
 */
function createJSONEditor(selector, options, json) {
    const container = (typeof selector === 'string')
        ? document.querySelector(selector)
        : selector;

    const editor = new JSONEditor(container, options, json);
    container.jsoneditor = editor;
    return editor;
}

