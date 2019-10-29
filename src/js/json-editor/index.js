// create the editor
import JSONEditor from "jsoneditor";
import $ from 'jquery';
import {isNil} from 'lodash';
import {Generator as SchemaGenerator} from "json-s-generator";
import {createCellsFrom} from '../jointjs-helper/diagram-generator';
import {jsonDocValidator, jsonSchemaValidator} from './schema-validators';
import {schema as bookSchema} from "../jointjs-helper/schema-examples";

const generator = new SchemaGenerator();

const jsonDocEditor = createJSONEditor(
    document.getElementById("json-doc-editor"),
    {
        mode: 'code',
        search: false,
        statusBar: true,
        enableTransform: false,
        history: true,
        schema: jsonDocValidator,
        onError: onError,
        onChange: onJsonDocChange
    },
    {}
);

const jsonSchemaEditor = createJSONEditor(
    document.getElementById("json-schema-editor"),
    {
        mode: 'code',
        search: false,
        statusBar: true,
        enableTransform: false,
        history: true,
        schema: jsonSchemaValidator,
        onError: onError,
        onChange: onJsonSchemaChange
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
function onJsonDocChange() {
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

function onJsonSchemaChange() {
    try {
        const jsonSchema = jsonSchemaEditor.get();
        if (jsonSchemaEditor.validateSchema(jsonSchema)) {
            enableButton();
        } else {
            disableButton();
        }
    } catch (err) {
        disableButton();
    }
}

const jsonDocModal = $('#jsonDocumentModal');

jsonDocModal.on('shown.bs.modal', (evt) => {
    showErrorsTable();
});

jsonDocModal.on('hidden.bs.modal', (evt) => {
    try {
        if (!jsonDocEditor) return;
        jsonDocEditor.set({});
    } catch (err) {
        console.log(err);
    }
});

const vizButton = $('#json-doc-viz-btn');

if (!!vizButton) vizButton.on('click', (evt) => {
    if (isNil(jsonDocEditor)) return;
    try {
        const inferredSchema = generator.getSchema(jsonDocEditor.get());
        createCellsFrom(inferredSchema);

        if (!!jsonDocModal) jsonDocModal.modal('hide');
    } catch (err) {
        console.log(err);
    }
});

const jsonSchemaModal = $('#jsonSchemaModal');

jsonSchemaModal.on('shown.bs.modal', (evt) => {
    showErrorsTable();
});

jsonSchemaModal.on('hidden.bs.modal', (evt) => {
    try {
        if (!jsonSchemaEditor) return;
        jsonSchemaEditor.set({});
    } catch (err) {
        console.log(err);
    }
});

const vizButton2 = $('#json-schema-viz-btn');

if (!!vizButton2) vizButton2.on('click', (evt) => {
    if (isNil(jsonSchemaEditor)) return;
    try {
        const jsonSchema = jsonSchemaEditor.get();
        createCellsFrom(jsonSchema);
        if (!!jsonSchemaModal) jsonSchemaModal.modal('hide');
    } catch (err) {
        console.log(err);
    }
});

function disableButton() {
    if (!!vizButton) vizButton.prop("disabled", true);
    if (!!vizButton2) vizButton2.prop("disabled", true);
}

function enableButton() {
    if (!!vizButton) vizButton.prop("disabled", false);
    if (!!vizButton2) vizButton2.prop("disabled", false);
}

function showErrorsTable() {
    const errorsTable = $('.jsoneditor-validation-errors');
    if (errorsTable.length > 0) return;

    const errorIcon = $('.jsoneditor-validation-error-icon');
    if (isNil(errorIcon)) return;

    errorIcon.trigger('click');
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

$('#example1').on('click', (evt) => {
    createCellsFrom(bookSchema);
});
