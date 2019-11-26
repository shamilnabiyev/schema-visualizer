import $ from 'jquery';
import uuidV4 from 'uuid/v4';
import _template from 'lodash/template';
import simpleRowTemplate from './template.html';

function isFieldNameValid(value) {
    return (/^([a-zA-Z0-9_]+)$/.test(value));
}

function createIDs() {
    return {
        propertyInfoId: `property-info-${uuidV4()}`,
        propertyEditorId: `property-editor-${uuidV4()}`,
        nameInputId: `field-name-input-${uuidV4()}`,
        typeSelectionId: `field-type-selection-${uuidV4()}`,
        removeButtonId: `remove-button-${uuidV4()}`,
        addButtonId: `add-button-${uuidV4()}`,
        cancelButtonId: `cancel-button-${uuidV4()}`,
        editButtonId: `edit-button-${uuidV4()}`,
    };
}

function findElements(row, IDs) {
    return {
        propertyInfo: row.find(`#${IDs.propertyInfoId}`),
        propertyEditor: row.find(`#${IDs.propertyEditorId}`),
        nameInput: row.find(`#${IDs.nameInputId}`),
        typeSelection: row.find(`#${IDs.typeSelectionId}`),
        removeButton: row.find(`#${IDs.removeButtonId}`),
        addButton: row.find(`#${IDs.addButtonId}`),
        cancelButton: row.find(`#${IDs.cancelButtonId}`),
        editButton: row.find(`#${IDs.editButtonId}`),
    };
}

export const createSeSimpleRow = function (fieldName, fieldType) {
    const IDs = createIDs();

    const row = $(_template(simpleRowTemplate)({
        fieldName: fieldName,
        fieldType: fieldType,
        IDs: IDs
    }));

    const {
        propertyInfo, propertyEditor, nameInput, typeSelection, removeButton, addButton, cancelButton, editButton
    } = findElements(row, IDs);

    removeButton.on('click', function () {
        row.fadeOut('100', function () {
            row.remove();
        });
    });

    editButton.on('click', function () {
        nameInput.val(row.attr('data-prop-name'));
        typeSelection.val(row.attr('data-prop-type'));
        addButton.prop("disabled", false);

        propertyInfo.css('display', 'none');
        propertyEditor.fadeIn('500');
    });

    nameInput.on('input propertychange', function () {
        if (isFieldNameValid(this.value)) {
            addButton.prop("disabled", false);
        } else {
            addButton.prop("disabled", true);
        }
    });

    addButton.on('click', function () {
        propertyInfo.children('.field-name').text(nameInput.val());
        propertyInfo.children('.field-type').text(typeSelection.children("option:selected").val());

        row.attr('data-prop-name', nameInput.val());
        row.attr('data-prop-type', typeSelection.children("option:selected").val());

        propertyEditor.css('display', 'none');
        propertyInfo.fadeIn('500');
    });

    cancelButton.on('click', function () {
        propertyEditor.css('display', 'none');
        propertyInfo.fadeIn('500');
    });

    return row;
};
