import $ from 'jquery';
import {htmlToJsonSchema} from "./html-to-json-schema";
import {createSeSimpleRow} from "./simple-row";
import {createSeObjectRow} from "./object-row";
import {createDiagramRoot} from "../jointjs-helper/diagram-generator";

const schemaEditorButton = $('#schema-editor-btn');
const schemaEditorModal = $('#schema-editor-modal');
const visualizeButton = schemaEditorModal.find('.visualize-btn');
const schemaTitleInput = schemaEditorModal.find('#schema-title-input');
const actionButton = schemaEditorModal.find('.visualize-btn');

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
    schemaTitleInput.val('');
    schemaTitleInput.removeClass('is-valid').addClass('is-invalid');

    const row1 = createSeObjectRow('ROOT', 'object');
    const schemaEditor = $('#schema-editor');
    schemaEditor.empty();
    schemaEditor.append(row1);

    $('#schema-editor > .object-row > .new-prop-container > .new-field-elements > .add-btn').prop("disabled", true);
    $('#schema-editor > .object-row > .form-inline > .remove-btn-block > .remove-btn').first().remove();
    $('#schema-editor > .object-row > .simple-row > .property-info > .field-name > .expander-btn').remove();
});

schemaTitleInput.on('input propertychange', function(){
    const invalidInputFeedback = schemaEditorModal.find('.invalid-feedback');
    if(isFieldNameValid(this.value)){
        actionButton.prop("disabled", false);
        schemaTitleInput.removeClass('is-invalid').addClass('is-valid');
        invalidInputFeedback.fadeOut();
    } else {
        actionButton.prop("disabled", true);
        schemaTitleInput.removeClass('is-valid').addClass('is-invalid');
        invalidInputFeedback.fadeIn();
    }
});

function isFieldNameValid(value){
    return (/^([a-zA-Z0-9_]+)$/.test(value));
}

export {createSeSimpleRow, createSeObjectRow};

