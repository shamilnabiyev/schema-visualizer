import $ from 'jquery';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template,
    isUndefined as _isUndefined,
    isNull as _isNull
} from 'lodash';
import { dia, shapes, util } from 'jointjs';
import {text} from "@fortawesome/fontawesome-svg-core";

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
    }, shapes.devs.Model.prototype.defaults)
});

CustomHtml.ElementView = dia.ElementView.extend({
    htmlTemplate: '',

    initialize: function () {
        _bindAll(this, 'updateBox');
        dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_template(this.htmlTemplate)());
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

        this.listenTo(this.model, 'change:template', this.templateOnUpdate);
    },

    addAdditionalEvents: function() {

    },

    templateOnUpdate: function () {
        console.log('templateOnUpdate fired!');
        // this.render();
    },

    appendValuesToTemplate: function name() {
        const customAttrs = this.model.get("customAttrs");
        let textValue = "";
        for (let a in customAttrs) {
            textValue = (!_isUndefined(customAttrs[a]) && !_isNull(customAttrs[a])) ? customAttrs[a] : "";
            this.$box.find('div.' + a + '> span').text(textValue);
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

export default CustomHtml;