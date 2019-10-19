import {bindAll as _bindAll} from "lodash";
import {dia} from "jointjs";

const initializeBox = function () {
    _bindAll(this, 'updateBox');
    dia.ElementView.prototype.initialize.apply(this, arguments);

    this.model.on('change', this.updateBox, this);
    this.model.on('remove', this.removeBox, this);
};

export default initializeBox;
