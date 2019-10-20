import {isNull as _isNull, isUndefined as _isUndefined} from "lodash";

const appendValuesToTemplate = function () {
    const customAttrs = this.model.get("customAttrs");
    let textValue = "";
    for (let a in customAttrs) {
        textValue = (!_isUndefined(customAttrs[a]) && !_isNull(customAttrs[a])) ? customAttrs[a] : "";
        this.$box.find('div.' + a + '> span').text(textValue);
    }
};

export default appendValuesToTemplate;