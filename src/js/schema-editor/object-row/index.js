import $ from 'jquery';
import {template as _template} from 'lodash';
import {createSeSimpleRow} from '../simple-row';
import objectRowTemplate from './template.html';

function resetInputs(row){
    const newFieldElements = row.children('.new-prop-container').children('.new-field-elements');
    newFieldElements.children("[name='field-name-input']").val('');
    newFieldElements.children('[name="field-type-selection"]').val('string');
    newFieldElements.children('.add-btn').prop("disabled", true);
}

function isFieldNameValid(value){
    return (/^([a-zA-Z0-9_]+)$/.test(value));
}

export const createSeObjectRow = function createSeObjectRow(field_Name, field_Type){
    const row = $(_template(objectRowTemplate)({fieldName: field_Name, fieldType: field_Type}));

    const properties = row.children('.new-prop-container').children('.properties');
    const newPropContainer = row.children('.new-prop-container');
    const newPropBlock = newPropContainer.children('.new-prop-block');
    const newFieldElements = newPropContainer.children('.new-field-elements');
    const fieldNameInput = newFieldElements.children("[name='field-name-input']");
    const fieldTypeSelection = newFieldElements.children('[name="field-type-selection"]');

    const expanderBtn = row.children('.simple-row').children('.property-info').children('.field-name').children('.expander-btn');
    const removeButton = row.children('.simple-row').children('.remove-btn-block').children('.remove-btn');
    const editButton = row.children('.simple-row').children('.remove-btn-block').children('.edit-btn');
    const addButton = newFieldElements.children('.add-btn');

    expanderBtn.on('click', function(){
        if(properties.children().length < 1) return;

        let isExpanded = ($(this).attr('data-expanded') === 'true');

        if(isExpanded) {
            $(this).attr('data-expanded', 'false');
            $(this).children('i').toggleClass('fa-chevron-down fa-chevron-right');

            newPropContainer.slideUp();
        } else {
            $(this).attr('data-expanded', 'true');
            $(this).children('i').toggleClass('fa-chevron-right fa-chevron-down');

            newPropContainer.slideDown();
        }
    });

    fieldNameInput.on('input propertychange', function(){
        if(isFieldNameValid(this.value)){
            newFieldElements.children('.add-btn').prop("disabled", false);
        } else {
            newFieldElements.children('.add-btn').prop("disabled", true);
        }
    });


    newPropBlock.children('button').on('click', function(){
        newPropBlock.css('display', 'none');
        newFieldElements.fadeIn('500');
    });

    newFieldElements.children('.cancel-btn').on('click', function(){
        newFieldElements.css('display', 'none');
        newPropBlock.fadeIn('500');
    });

    addButton.on('click', function(){
        const fieldName = fieldNameInput.val();

        if (_.isEmpty(fieldName)) {
            alert('field name must be a valid string');
            return;
        }

        const fieldType = fieldTypeSelection.children("option:selected").val();
        row.find('.empty-placeholder').remove();

        switch(fieldType){
            case 'string':
            case 'integer':
            case 'number':
            case 'boolean':
                const simpleRow = createSeSimpleRow(fieldName, fieldType);
                properties.append(simpleRow);
                break;

            case 'object':
            case 'array':
                const objectRow = createSeObjectRow(fieldName, fieldType);
                properties.append(objectRow);
                break;
        }

        newFieldElements.css('display', 'none');
        newPropBlock.fadeIn('500');
        resetInputs(row);
    });

    removeButton.on('click', function(){
        row.remove();
    });

    editButton.on('click', function(){
        console.log('EDIT');
    });

    return row;
};