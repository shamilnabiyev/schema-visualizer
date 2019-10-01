import 'bootstrap/dist/js/bootstrap.bundle';
import './sb-admin-2.js';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import Backbone from 'backbone';
import {dia, shapes} from 'jointjs';
import './fontAwesomeCustom.js';

import {
    portOptions, createLink, createPaper, createCoupled, createCustomElement
} from './jointjs-helper/JointJsHelper';

import 'typeface-nunito';
import 'fontawesome_min_css';
import 'fontawesome_solid_min_css';
import 'jointjs_min_css';
import '../scss/index.scss';

import CustomElement from './schema-diagram/common/CustomHtmlElement';
// import simple_row from "./schema-diagram/simple-row/";
// import diagram_title from "./schema-diagram/diagram-title/";
import simpleRowTemplate from "./schema-diagram/simple-row/SimpleRow.html";
import diagramTitleTemplate from "./schema-diagram/diagram-title/DiagramTitle.html";

(function ($) {
    var graph = new dia.Graph();
    var paper = createPaper($('#paper-html-elements'), graph);

    var c1 = createCoupled({ text: 'USER', x: 50, y: 15, width: 400, height: 175 });

    var t1 = createCustomElement({ title: 'USER', template: diagramTitleTemplate, x: 50, y: 15, width: 400, height: 175 });


    var sr1 = new CustomElement.Element({
        template: simpleRowTemplate,
        customAttrs: {
            field_name: 'id',
            field_constraints: 'ID, req, unq, idx',
            field_date_type: 'str'
        },
        size: { width: 400, height: 35 },
        position: { x: 50, y: 50 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr2 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'password',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: { x: 50, y: 85 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr3 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'email',
            field_constraints: 'req, unq, idx',
            field_date_type: 'str',
        },
        position: { x: 50, y: 120 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var c2 = new shapes.devs.Coupled({
        attrs: { text: { text: 'ORDER' } },
        position: { x: 700, y: 15 },
        size: { width: 400, height: 175 },
        attrs: {
            rect: { stroke: '#ffffff', 'stroke-width': 1 }
        }
    });

    var t2 = new CustomElement.Element({
        template: diagramTitleTemplate,
        customAttrs: {
            entity_title: "ORDER"
        },
        position: { x: 700, y: 15 },
        size: { width: 400, height: 35 }
    });

    var sr21 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'id',
            field_constraints: 'ID, req, unq, idx',
            field_date_type: 'str',
        },
        position: { x: 700, y: 50 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr22 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'created_on',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: { x: 700, y: 85 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr23 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'user_id',
            field_constraints: 'REF, req',
            field_date_type: 'str',
        },
        position: { x: 700, y: 120 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    c1.embed(t1);
    c1.embed(sr1);
    c1.embed(sr2);
    c1.embed(sr3);
    c2.embed(t2);
    c2.embed(sr21);
    c2.embed(sr22);
    c2.embed(sr23);


    graph.addCells([c1, t1, sr1, sr2, sr3, c2, t2, sr21, sr22, sr23]);

    c1.toFront();
    c2.toFront();

    try {
        var newLink = createLink(sr23, "in", sr1, "out", "");
        newLink.addTo(graph).reparent();
    } catch (error) {
        console.log(error);
    }


    /**
     * Model with multiple ports
     */
    var m1 = new shapes.devs.Model({
        position: { x: 150, y: 250 },
        size: { width: 180, height: 180 },
        inPorts: ['in1', 'in2', 'in3', 'in4'],
        outPorts: ['out1', 'out2', 'out3', 'out4'],
        attrs: {
            '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
            rect: { fill: '#2ECC71' }
        }
    });
    graph.addCell(m1);


    paper.scale(0.7, 0.7);
    paper.on('blank:mousewheel', (event, x, y, delta) => {
        event.preventDefault();
        zoomOnMousewheel(delta);
    });

    paper.on('cell:mousewheel', (_, event, x, y, delta) => {
        event.preventDefault();
        zoomOnMousewheel(delta);
    });

    function zoomOnMousewheel(delta) {
        const scale = paper.scale();
        const newScaleX = scale.sx + (delta * 0.01);
        const newScaleY = scale.sy + (delta * 0.01);
        if (newScaleX >= 0.2 && newScaleX <= 2) paper.scale(newScaleX, newScaleY);
    }

    document.getElementById("zoom-in-btn").onclick = function onClickZoomIn() {
        const scale = paper.scale();
        const newScaleX = scale.sx + 0.05;
        const newScaleY = scale.sy + 0.05;
        if (newScaleX >= 0.2 && newScaleX <= 2) paper.scale(newScaleX, newScaleY);
    };

    document.getElementById("zoom-out-btn").onclick = function onClickZoomOut(params) {
        const scale = paper.scale();
        const newScaleX = scale.sx - 0.05;
        const newScaleY = scale.sy - 0.05;
        if (newScaleX >= 0.2 && newScaleX <= 2) paper.scale(newScaleX, newScaleY);
    };

})(jQuery);