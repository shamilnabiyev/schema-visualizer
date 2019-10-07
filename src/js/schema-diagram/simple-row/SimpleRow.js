import $ from 'jquery';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template,
    isUndefined as _isUndefined,
    isNull as _isNull
} from 'lodash';
import { dia, shapes, util } from 'jointjs';

/**
 * Use the new custom html element tutorial
 * 
 * URL: https://github.com/clientIO/joint/blob/master/demo/shapes/src/html.js
 */

if (_isUndefined(shapes.html)) {
    shapes.html = {};
}

const SimpleRow = shapes.html.SimpleRow = {};
SimpleRow.Element = shapes.devs.Model.extend({
    defaults: util.deepSupplement({
        type: 'html.SimpleRow.Element',
        attrs: {
            '.body': { stroke: '#ffffff' }
        }
    }, shapes.devs.Model.prototype.defaults)
});

SimpleRow.ElementView = dia.ElementView.extend({
    initialize: function () {
        _bindAll(this, 'updateBox');
        dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_template(this.model.get("template"))());
        this.$box.find('.delete').on('click', _bind(this.model.remove, this.model));

        this.$box.find('.flex-container').on('mousedown', function (evt) {
            evt.stopPropagation();
        });

        this.$box.find('.flex-container').on('click', function (evt) {
            evt.stopPropagation();

            /* Show/hide the clicked row */
        });

        this.appendValuesToTemplate();

        this.model.on('change', this.updateBox, this);
        this.model.on('remove', this.removeBox, this);

        this.listenTo(this.model, 'change:template', this.templateOnUpdate);
    },
    templateOnUpdate: function () {
        console.log('templateOnUpdate fired!');
        this.render();
    },

    appendValuesToTemplate: function name() {
        const customAttrs = this.model.get("customAttrs");
        for (var a in customAttrs) {
            this.$box.find('div.' + a + '> span').text(customAttrs[a]);
        }
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

export default SimpleRow;