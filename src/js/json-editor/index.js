// create the editor
import JSONEditor from "jsoneditor";
import $ from 'jquery';
import {isNil} from 'lodash';
import {Generator as SchemaGenerator} from "json-s-generator";
import {createCellsFrom} from '../jointjs-helper/diagram-generator';

const generator = new SchemaGenerator();

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
        onError: onError,
        onChange: onChange
    },
    {}
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
 * isn't valid against the pre defined schema, then will be an error thrown and the
 * button 'Visualize' will be disabled. The button will be also disable, if there
 * occurs an error.
 */
function onChange() {
    try {
        if (!!jsonDocEditor) {
            const json = jsonDocEditor.get();
            if (jsonDocEditor.validateSchema(json)) {
                enableButton();
            } else {
                disableButton();
            }
        }
    } catch (e) {
        disableButton();
    }
}

const vizButton = $('#json-doc-viz-btn');

if (!!vizButton) vizButton.on('click', (evt) => {
    if (isNil(jsonDocEditor)) return;
    try {
        const inferredSchema = generator.getSchema(jsonDocEditor.get());
        createCellsFrom(inferredSchema);

        const jsonDocumentModal = $('#jsonDocumentModal');
        if(!!jsonDocumentModal) jsonDocumentModal.modal('hide');
    } catch (err) {
        console.log(err);
    }
});

function disableButton() {
    if (!!vizButton) vizButton.prop("disabled", true);
}

function enableButton() {
    if (!!vizButton) vizButton.prop("disabled", false);
}


const jsonDocModal = $('#jsonDocumentModal');

jsonDocModal.on('shown.bs.modal', (evt) => {
    const errorsTable = $('.jsoneditor-validation-errors');
    if (errorsTable.length > 0) return;

    const errorIcon = $('.jsoneditor-validation-error-icon');
    if (isNil(errorIcon)) return;

    errorIcon.trigger('click');
});

jsonDocModal.on('hidden.bs.modal', (evt) => {
    try {
        if (!jsonDocEditor) return;
        jsonDocEditor.set({});
    } catch (err) {
        console.log(err);
    }
});


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


/**
 * Find a JSONEditor instance from it's container element or id
 * @param {string | Element} selector  A query selector id like '#myEditor'
 *                                     or a DOM element
 * @return {JSONEditor | null} Returns the created JSONEditor, or null otherwise.
 */
function findJSONEditor(selector) {
    const container = (typeof selector === 'string')
        ? document.querySelector(selector)
        : selector;

    return container && container.jsoneditor || null;
}


