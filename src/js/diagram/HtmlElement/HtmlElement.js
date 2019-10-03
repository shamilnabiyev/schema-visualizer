import $ from 'jquery';
import {
    bind as _bind,
    bindAll as _bindAll,
    template as _template
} from 'lodash';
import { dia, shapes, util } from 'jointjs';

var xhtml = shapes.xhtml = {};

xhtml.Element = dia.Element.define('xhtml.Element', {
    attrs: {
        placeholder: {
            refWidth: '100%',
            refHeight: '100%',
            stroke: 'gray'
        }
    }
}, {
    markup: [{
        tagName: 'rect',
        selector: 'placeholder'
    }]
});

// Create a custom view for that element that displays an HTML div above it.
// -------------------------------------------------------------------------

xhtml.ElementView = dia.ElementView.extend({

    template: [
        '<div class="html-element">',
        '<label data-attribute="mylabel"></label>',
        '<input data-attribute="myinput" type="text"/>',
        '</div>'
    ].join(''),

    init: function() {

        // Update the box position whenever the underlying model changes.
        this.listenTo(this.model, 'change', this.updateBox);
    },

    onBoxChange: function(evt) {

        var input = evt.target;
        var attribute = input.dataset.attribute;
        if (attribute) {
            this.model.set(attribute, input.value);
        }
    },

    onRender: function() {

        if (this.$box) this.$box.remove();

        var boxMarkup = util.template(this.template)();
        var $box = this.$box = $(boxMarkup);

        this.$attributes = $box.find('[data-attribute]');

        // React on all box changes. e.g. input change
        $box.on('change', this.onBoxChange.bind(this));

        // Update the box size and position whenever the paper transformation changes.
        // Note: there is no paper yet on `init` method.
        this.listenTo(this.paper, 'scale translate', this.updateBox);

        $box.appendTo(this.paper.el);
        this.updateBox();

        return this;
    },

    updateBox: function() {

        // Set the position and the size of the box so that it covers the JointJS element
        // (taking the paper transformations into account).
        var bbox = this.getBBox({ useModelGeometry: true });
        var scale = this.paper.scale();

        this.$box.css({
            transform: 'scale(' + scale.sx + ',' + scale.sy + ')',
            transformOrigin: '0 0',
            width: bbox.width / scale.sx,
            height: bbox.height / scale.sy,
            left: bbox.x,
            top: bbox.y
        });

        this.updateAttributes();
    },

    updateAttributes: function() {

        var model = this.model;

        this.$attributes.each(function() {

            var value = model.get(this.dataset.attribute);

            switch (this.tagName.toUpperCase()) {
                case 'LABEL':
                    this.textContent = value;
                    break;
                case 'INPUT':
                    this.value = value;
                    break;
            }
        });
    },

    onRemove: function() {

        this.$box.remove();
    }

});

// console.log('html', html);

export default xhtml;