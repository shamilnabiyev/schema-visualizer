import $ from 'jquery';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template,
    isUndefined as _isUndefined,
    isNull as _isNull
} from 'lodash';
import { dia, shapes, util } from 'jointjs';
import {renderBox, updateBox, removeBox} from '../utils';

if (_isUndefined(shapes.html)) {
    shapes.html = {};
}

const CustomHtml = shapes.html;

CustomHtml.Element = shapes.devs.Model.extend({
    defaults: util.defaultsDeep({
        type: 'html.Element',
        attrs: {
            '.body': { stroke: '#ffffff' }
        }
    }, shapes.devs.Model.prototype.defaults),
    rowLevel: 0
});

CustomHtml.ElementView = dia.ElementView.extend({
    htmlTemplate: '',

    initialize: function () {
        _bindAll(this, 'updateBox');
        dia.ElementView.prototype.initialize.apply(this, arguments);

        let rowLevel = this.model.get("rowLevel");
        this.$box = $(_template(this.htmlTemplate)({'rowLevel': rowLevel}));

        const deleteButton = this.$box.find('.delete');
        if (!_isUndefined(deleteButton) && !_isNull(deleteButton)) {
            deleteButton.on('click', _bind(this.model.remove, this.model));
        }

        const flexContainer = this.$box.find('.flex-container');
        if (!_isUndefined(flexContainer) && !_isNull(flexContainer)) {
            flexContainer.on('mousedown', (evt) => { evt.stopPropagation(); });
            flexContainer.on('click', (evt) => { evt.stopPropagation(); });
        }

        this.appendValuesToTemplate();
        this.addAdditionalEvents();

        this.model.on('change', this.updateBox, this);
        this.model.on('remove', this.removeBox, this);
    },

    addAdditionalEvents: function() {

    },

    appendValuesToTemplate: function name() {
        const customAttrs = this.model.get("customAttrs");
        let textValue = "";
        for (let a in customAttrs) {
            textValue = (!_isUndefined(customAttrs[a]) && !_isNull(customAttrs[a])) ? customAttrs[a] : "";
            this.$box.find('div.' + a + '> span').text(textValue);
        }
    },

    render: renderBox,
    updateBox: updateBox,
    removeBox: removeBox
});

export default CustomHtml;