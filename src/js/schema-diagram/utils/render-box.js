import {dia} from "jointjs";

const render = function () {
    dia.ElementView.prototype.render.apply(this, arguments);
    this.listenTo(this.paper, 'scale', this.updateBox);
    this.listenTo(this.paper, 'translate', this.updateBox);
    this.paper.$el.prepend(this.$box);
    this.updateBox();
    return this;
};

export default render;