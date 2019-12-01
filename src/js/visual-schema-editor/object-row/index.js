import $ from 'jquery';
import uuidV4 from 'uuid/v4';
import _template from 'lodash/template';
import {replace as featherIconsReplace} from 'feather-icons/dist/feather.min';
import {createSeSimpleRow} from '../simple-row';
import objectRowTemplate from './template.html';

function createIDs() {
    return {
        newPropContainerId: `new-prop-container-${uuidV4()}`,
        propertiesId: `properties-${uuidV4()}`,
        newPropBlockId: `new-prop-block-${uuidV4()}`,
        newFieldElementsId: `new-field-elements-${uuidV4()}`,
        fieldNameInputId: `field-name-input-${uuidV4()}`,
        fieldTypeSelectionId: `field-type-selection-${uuidV4()}`,
        addButtonId: `add-button-${uuidV4()}`,
        cancelButtonId: `cancel-button-${uuidV4()}`,
        removeButtonId: `remove-button-${uuidV4()}`,
        expanderButtonId: `expander-button-${uuidV4()}`,
    };
}

function findElements(row, IDs) {
    return {
        properties: row.find(`#${IDs.propertiesId}`),
        newPropContainer: row.find(`#${IDs.newPropContainerId}`),
        newPropBlock: row.find(`#${IDs.newPropBlockId}`),
        newFieldElements: row.find(`#${IDs.newFieldElementsId}`),
        fieldNameInput: row.find(`#${IDs.fieldNameInputId}`),
        fieldTypeSelection: row.find(`#${IDs.fieldTypeSelectionId}`),
        addButton: row.find(`#${IDs.addButtonId}`),
        cancelButton: row.find(`#${IDs.cancelButtonId}`),
        removeButton: row.find(`#${IDs.removeButtonId}`),
        expanderButton: row.find(`#${IDs.expanderButtonId}`),
    };
}

function isFieldNameValid(value) {
    return (/^([a-zA-Z0-9_]+)$/.test(value));
}

export const createSeObjectRow = function createSeObjectRow(field_Name, field_Type) {
    const IDs = createIDs();

    const row = $(_template(objectRowTemplate)({
        fieldName: field_Name,
        fieldType: field_Type,
        IDs: IDs,
    }));

    const {
        properties, newPropContainer, newPropBlock, newFieldElements, fieldNameInput, fieldTypeSelection,
        addButton, cancelButton, removeButton, expanderButton
    } = findElements(row, IDs);

    expanderButton.on('click', function () {
        if (properties.children().length < 1) return;

        let isExpanded = ($(this).attr('data-expanded') === 'true');

        if (isExpanded) {
            $(this).attr('data-expanded', 'false');
            $(this).children('i').toggleClass('fa-chevron-down fa-chevron-right');

            newPropContainer.slideUp();
        } else {
            $(this).attr('data-expanded', 'true');
            $(this).children('i').toggleClass('fa-chevron-right fa-chevron-down');

            newPropContainer.slideDown();
        }
    });

    fieldNameInput.on('input propertychange', function () {
        if (isFieldNameValid(this.value)) {
            newFieldElements.children('.add-btn').prop("disabled", false);
        } else {
            newFieldElements.children('.add-btn').prop("disabled", true);
        }
    });


    newPropBlock.children('button').on('click', function () {
        newPropBlock.css('display', 'none');
        newFieldElements.fadeIn('500');
    });

    cancelButton.on('click', function () {
        newFieldElements.css('display', 'none');
        newPropBlock.fadeIn('500');
        resetInput();
    });

    addButton.on('click', function () {
        const fieldName = fieldNameInput.val();

        if (_.isEmpty(fieldName)) {
            alert('Property name must be a valid string');
            return;
        }

        const fieldType = fieldTypeSelection.children("option:selected").val();
        row.find('.empty-placeholder').remove();

        switch (fieldType) {
            case 'string':
            case 'integer':
            case 'number':
            case 'boolean':
                const simpleRow = createSeSimpleRow(fieldName, fieldType).hide();
                properties.append(simpleRow);
                featherIconsReplace();
                simpleRow.fadeIn();
                break;

            case 'object':
            case 'array':
                const objectRow = createSeObjectRow(fieldName, fieldType).hide();
                properties.append(objectRow);
                featherIconsReplace();
                objectRow.fadeIn();
                break;
        }

        newFieldElements.css('display', 'none');
        newPropBlock.fadeIn('500');
        resetInput();
    });

    removeButton.on('click', function () {
        row.fadeOut('100', function () {
            row.remove();
        });
    });

    function resetInput() {
        fieldNameInput.val('');
        fieldTypeSelection.val('string');
        addButton.prop("disabled", true);
    }

    return row;
};