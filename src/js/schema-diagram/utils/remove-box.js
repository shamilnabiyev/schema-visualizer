import {
    has as _has,
    isNil as _isNil
} from 'lodash';
const removeBox = function (evt) {
    if(_isNil(this)) return;
    if(!_has(this, '$box')) return;
    if(_isNil(this.$box)) return;

    this.$box.remove();
};

export default removeBox;