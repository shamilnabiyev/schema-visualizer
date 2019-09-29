import * as $ from 'jquery';
import * as _ from 'lodash';
import Backbone from 'backbone';
import * as joint from 'jointjs';

var html = joint.shapes.html = {};
html.Element = joint.shapes.devs.Atomic.extend({
    defaults: joint.util.deepSupplement({
        type: 'html.Element',
        attrs: {
            rect: { stroke: 'none', 'fill-opacity': 0 }
        }
    }, joint.shapes.devs.Atomic.prototype.defaults)
});

html.ElementView = joint.dia.ElementView.extend({
    initialize: function () {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.model.get("template"))());
        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        this.model.on('change', this.updateBox, this);
        this.model.on('remove', this.removeBox, this);
        this.updateBox();
    },

    render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
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
        for(var a in customAttrs) {
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