// create the editor
import JSONEditor from "jsoneditor";
import $ from 'jquery';
import {isNil} from 'lodash';
import {json as schemaGenerator} from 'generate-schema';
import {createDiagramRoot, addRect, updateDiagramRoot} from '../jointjs-helper/diagram-generator';
import {jsonDocValidator, jsonSchemaValidator} from './schema-validators';
import {schema as bookSchema} from "../jointjs-helper/schema-examples";

const jsonEditorModal = $('#jsonEditorModal');
const modalTitle = $('#jsonEditorModal .modal-title');
const actionButton = $('#json-editor-action-btn');
const entityTypeNameInput = $('#entity-type-name-input');
const invalidFeedbackBlock = $('#entity-type-name-form .invalid-feedback');
actionButton.off('click');

const jsonEditor = createJSONEditor(
    document.getElementById("json-editor"),
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
        if (!!jsonEditor) {
            const json = jsonEditor.get();
            if (jsonEditor.validateSchema(json) && isEntityTypeNameValid()) {
                actionButton.prop("disabled", false);
            } else {
                showErrorsTable();
                actionButton.prop("disabled", true);
            }
        }
    } catch (e) {
        actionButton.prop("disabled", true);
    }
}

jsonEditorModal.on('shown.bs.modal', (evt) => {
    showErrorsTable();
    onJsonDocChange();
});

jsonEditorModal.on('hidden.bs.modal', (evt) => {
    entityTypeNameInput.val('');
    entityTypeNameInput.removeClass('is-valid').addClass('is-invalid');
});


function showErrorsTable() {
    const errorsTable = $('.jsoneditor-validation-errors');
    if (errorsTable.length > 0) return;

    const errorIcon = $('.jsoneditor-validation-error-icon');
    if (isNil(errorIcon) || errorIcon.css('display') === 'none') return;

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

$('#example1').on('click', (evt) => {
    createDiagramRoot(bookSchema);
});

$('#json-doc-button').on('click', () => {
    jsonEditor.set({});
    jsonEditor.setSchema(jsonDocValidator);

    actionButton.off('click');
    actionButton.on('click', (evt) => {
        if (isNil(jsonEditor)) return;
        try {
            let inferredSchema = schemaGenerator(jsonEditor.get());
            if(inferredSchema['type'] === 'array') inferredSchema = inferredSchema['items'];
            inferredSchema["title"] = entityTypeNameInput.val() || "";
            createDiagramRoot(inferredSchema);
            jsonEditorModal.modal('hide');
        } catch (err) {
            console.log(err);
        }
    });

    modalTitle.text('Import a JSON Document');
    actionButton.text('Visualize');
    jsonEditorModal.modal('show');
});

$('#json-schema-button').on('click', () => {
    jsonEditor.set({});
    jsonEditor.setSchema(jsonSchemaValidator);

    actionButton.off('click');
    actionButton.on('click', (evt) => {
        if (isNil(jsonEditor)) return;
        try {
            const doc = jsonEditor.get();
            doc["title"] = entityTypeNameInput.val() || "";
            createDiagramRoot(doc);
            jsonEditorModal.modal('hide');
        } catch (err) {
            console.log(err);
        }
    });

    modalTitle.text('Import a JSON-Schema');
    actionButton.text('Visualize');
    jsonEditorModal.modal('show');
});

function isEntityTypeNameValid() {
    return (/^([a-zA-Z0-9_]+)$/.test(entityTypeNameInput.val()));
}

entityTypeNameInput.on('input propertychange', function () {
    const isValid = isEntityTypeNameValid();
    if (isValid) {
        invalidFeedbackBlock.fadeOut();
        entityTypeNameInput.removeClass('is-invalid').addClass('is-valid');
        actionButton.prop("disabled", false);
    } else {
        invalidFeedbackBlock.fadeIn();
        entityTypeNameInput.removeClass('is-valid').addClass('is-invalid');
        actionButton.prop("disabled", true);
    }
});

export const openSchemaUpdateModal = function (diagramRoot) {
    const diagramRootSchema = diagramRoot.getSchema();

    jsonEditor.set(diagramRootSchema);
    jsonEditor.setSchema(jsonSchemaValidator);

    entityTypeNameInput.val(diagramRootSchema["title"] || "");
    entityTypeNameInput.removeClass('is-invalid').addClass('is-valid');

    modalTitle.text('Update the Schema');
    actionButton.text('Update');

    actionButton.off('click');
    actionButton.on('click', (evt) => {
        if (isNil(jsonEditor)) return;
        try {
            const updatedSchema = jsonEditor.get();
            updatedSchema["title"] = entityTypeNameInput.val() || "";
            diagramRoot.setSchema(updatedSchema);

            updateDiagramRoot(diagramRoot);
            jsonEditorModal.modal('hide');
        } catch (err) {
            console.log(err);
        }
    });
    jsonEditorModal.modal('show');
};