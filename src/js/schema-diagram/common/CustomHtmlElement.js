import $ from 'jquery';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template
} from 'lodash';
import { dia, shapes, util } from 'jointjs';

var html = shapes.html = {};
html.Element = shapes.devs.Model.extend({
    defaults: util.deepSupplement({
        type: 'html.Element',
        attrs: {
            rect: { stroke: 'none', 'fill-opacity': 0 }
        }
    }, shapes.devs.Model.prototype.defaults)
});

html.state = {templates: []};

html.ElementView = dia.ElementView.extend({
    initialize: function () {
        _bindAll(this, 'updateBox');
        dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_template(this.model.get("template"))());
        this.$box.find('.delete').on('click', _bind(this.model.remove, this.model));
        this.model.on('change', this.updateBox, this);
        this.model.on('remove', this.removeBox, this);
        this.updateBox();
    },

    render: function () {
        dia.ElementView.prototype.render.apply(this, arguments);
        this.listenTo(this.paper, 'scale', this.updateBox);
        this.listenTo(this.paper, 'translate', this.updateBox);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
    },

    updateBox: function () {
        if (!this.paper) return;
        const bbox = this.getBBox({ useModelGeometry: true });

        const customAttrs = this.model.get("customAttrs");
        for (var a in customAttrs) {
            this.$box.find('div.' + a).text(customAttrs[a]);
        }

        const scale = this.paper.scale();
        this.$box.css({
            transform: `scale(${scale.sx},${scale.sy})`,
            transformOrigin: '0 0',
            width: bbox.width / scale.sx,
            height: bbox.height / scale.sy,
            left: bbox.x,
            top: bbox.y,
        });
    },

    removeBox: function (evt) {
        this.$box.remove();
    }
});

export default html;