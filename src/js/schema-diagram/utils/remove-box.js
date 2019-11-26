import _isNil from 'lodash/isNil';
import _has from 'lodash/has';
const removeBox = function (evt) {
    if(_isNil(this)) return;
    if(!_has(this, '$box')) return;
    if(_isNil(this.$box)) return;

    this.$box.remove();
};

export default removeBox;