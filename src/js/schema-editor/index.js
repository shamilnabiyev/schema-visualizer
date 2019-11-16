import $ from 'jquery';
import {createSeSimpleRow} from "./simple-row";
import {createSeObjectRow} from "./object-row";

// schema-editor-btn
const schemaEditorButton = $('#schema-editor-btn');
const schemaEditorModal = $('#schema-editor-modal');

schemaEditorButton.on('click', function () {
    schemaEditorModal.modal('show');
});

schemaEditorModal.on('shown.bs.modal', function () {
    const row1 = createSeObjectRow('ROOT', 'object');

    $('#schema-editor').append(row1);
    $('#schema-editor > .new-prop-container > .new-field-elements > .add-btn').prop("disabled", true);
    $('#schema-editor > .object-row > .form-inline > .remove-btn-block > .remove-btn').first().remove();
    $('#schema-editor > .object-row > .simple-row > .property-info > .field-name > .expander-btn').remove();
});

export {createSeSimpleRow, createSeObjectRow};

