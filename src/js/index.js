import 'bootstrap/dist/js/bootstrap.bundle';
import './sb-admin-2.js';
import jQuery from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import { dia, shapes } from 'jointjs';
import ulElem from './jointjs-helper/templateGenerator';
import './fontAwesomeCustom.js';

import {
    portOptions, createLink, createPaper, createCoupled, createCustomElement, createUserSchemaDagram, createExampleDiagrams
} from './jointjs-helper/JointJsHelper';

import 'typeface-nunito';
import 'fontawesome_min_css';
import 'fontawesome_solid_min_css';
import 'jointjs_min_css';
import '../scss/index.scss';

(function ($) {
    var graph = new dia.Graph();
    var paper = createPaper($('#paper-html-elements'), graph);

    createExampleDiagrams(graph, paper);

    paper.on('link:mouseenter', function (linkView) {
        linkView.showTools();
    });

    paper.on('link:mouseleave', function (linkView) {
        linkView.hideTools();
    });

    /**
     * Model with multiple ports
     */
    var m1 = new shapes.devs.Model({
        position: { x: 80, y: 380 },
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

    $(".object-row-expander").on('click', function name() {
        console.log("Object row expander clicked!");
    });
})(jQuery);