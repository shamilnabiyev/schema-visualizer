import $ from 'jquery';
import {template as _template} from 'lodash';
import simpleRowTemplate from './template.html';

function isFieldNameValid(value){
    return (/^([a-zA-Z0-9_]+)$/.test(value));
}

export const createSeSimpleRow = function (fieldName, fieldType){
    const row = $(_template(simpleRowTemplate)({fieldName: fieldName, fieldType: fieldType}));

    const propertyInfo = row.children('.property-info');
    const propertyEditor = row.children('.property-editor');
    const nameInput = propertyEditor.children("[name='field-name-input']");
    const typeSelection = propertyEditor.children("[name='field-type-selection']");
    const removeButton = row.children('.remove-btn-block').children('.remove-btn');
    const addBtn = propertyEditor.children('.add-btn');
    const cancelButton = propertyEditor.children('.cancel-btn');

    removeButton.on('click', function(){
        row.fadeOut('100', function(){
            row.remove();
        });
    });

    row.children('.remove-btn-block').children('.edit-btn').on('click', function(){
        nameInput.val(row.attr('data-prop-name'));
        typeSelection.val(row.attr('data-prop-type'));
        addBtn.prop("disabled", false);

        propertyInfo.css('display', 'none');
        propertyEditor.fadeIn('500');
    });

    nameInput.on('input propertychange', function(){
        if(isFieldNameValid(this.value)){
            addBtn.prop("disabled", false);
        } else {
            addBtn.prop("disabled", true);
        }
    });

    addBtn.on('click', function(){
        propertyInfo.children('.field-name').text(nameInput.val());
        propertyInfo.children('.field-type').text(typeSelection.children("option:selected").val());

        row.attr('data-prop-name', nameInput.val());
        row.attr('data-prop-type', typeSelection.children("option:selected").val());

        propertyEditor.css('display', 'none');
        propertyInfo.fadeIn('500');
    });

    cancelButton.on('click', function(){
        propertyEditor.css('display', 'none');
        propertyInfo.fadeIn('500');
    });

    return row;
};
