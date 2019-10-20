import {
    bindAll as _bindAll,
    isFunction as _isFunction,
    isUndefined as _isUndefined,
    isNull as _isNull,
    template as _template
} from "lodash";
import {dia} from "jointjs";
import $ from "jquery";

const initializeBox = function () {
    _bindAll(this, 'updateBox');
    dia.ElementView.prototype.initialize.apply(this, arguments);

    let rowLevel = this.model.get("rowLevel");
    this.$box = null;
    if (!_isUndefined(this.htmlTemplate)) this.$box = $(_template(this.htmlTemplate)({'rowLevel': rowLevel}));

    let flexContainer = null;
    if (!_isNull(this.$box))  flexContainer = this.$box.find('.flex-container');

    if (!_isUndefined(flexContainer) && !_isNull(flexContainer)) {
        flexContainer.on('mousedown', (evt) => { evt.stopPropagation(); });
        flexContainer.on('click', (evt) => { evt.stopPropagation(); });
    }

    if (_isFunction(this.appendValuesToTemplate)) this.appendValuesToTemplate();
    if (_isFunction(this.addAdditionalEvents)) this.addAdditionalEvents();

    this.model.on('change', this.updateBox, this);
    this.model.on('remove', this.removeBox, this);
};

export default initializeBox;
