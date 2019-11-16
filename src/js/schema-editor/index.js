import $ from 'jquery';
import {htmlToJsonSchema} from "./html-to-json-schema";
import {createSeSimpleRow} from "./simple-row";
import {createSeObjectRow} from "./object-row";
import {createDiagramRoot} from "../jointjs-helper/diagram-generator";

// import './html-to-json-schema';

const schemaEditor = $('#schema-editor');
const schemaEditorButton = $('#schema-editor-btn');
const schemaEditorModal = $('#schema-editor-modal');
const visualizeButton = schemaEditorModal.find('.visualize-btn');

schemaEditorButton.on('click', function () {
    schemaEditorModal.modal('show');
});

visualizeButton.on('click', function () {
    const properties = $('#schema-editor').children('.object-row').children('.new-prop-container').children('.properties');
    if(properties.children().length < 1) {
        alert('At least one property is required');
        return;
    }
    const jsonSchema = htmlToJsonSchema(properties.html());
    createDiagramRoot(jsonSchema);
    schemaEditorModal.modal('hide');
});

schemaEditorModal.on('show.bs.modal', function () {
    const row1 = createSeObjectRow('ROOT', 'object');

    $('#schema-editor').empty();
    $('#schema-editor').append(row1);
    $('#schema-editor > .object-row > .new-prop-container > .new-field-elements > .add-btn').prop("disabled", true);
    $('#schema-editor > .object-row > .form-inline > .remove-btn-block > .remove-btn').first().remove();
    $('#schema-editor > .object-row > .simple-row > .property-info > .field-name > .expander-btn').remove();
});




export {createSeSimpleRow, createSeObjectRow};

