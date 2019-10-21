/* Import the core libs */
import $ from 'jquery';
import {dia, shapes} from 'jointjs';
import 'bootstrap/dist/js/bootstrap.bundle';
import './ui-script.js';
import './font-awesome-custom.js';
/* Import the custom classes */
import generateCells from "./jointjs-helper/diagram-generator";
import {addInfoButton, createPaper, createDummyDiagrams} from './jointjs-helper/jointjs-helper';
import 'typeface-nunito';
import 'fontawesome_min_css';
import 'fontawesome_solid_min_css';
import 'jointjs_min_css';
import '../scss/index.scss';
import {
    forEach as _forEach,
    isUndefined as _isUndefined
} from "lodash";
/* contains DiagramRoot.Element and DiagramRoot.ElementView */
import HierarchyBase from "./schema-diagram/common/hierarchy-base";
import DiagramRoot from "./schema-diagram/diagram-root";
import DiagramTitle from "./schema-diagram/diagram-title";
import CustomHtml from "./schema-diagram/common/html-element";
import ObjectRow from "./schema-diagram/object-row/object-row";
import SimpleRow from "./schema-diagram/simple-row/simple-row";

$(window).on("load", () => {
    $('#loading-icon').remove();
    $('#wrapper').css("visibility", "initial");
});


// console.log('shapes.html', shapes.html);

const graph = new dia.Graph();

const paper = createPaper($('#paper-html-elements'), graph);
paper.scale(0.7, 0.7);

graph.on('add', (cell) => {
    if (cell instanceof dia.Link) {
        addInfoButton(cell, paper);
    }
});

createDummyDiagrams(graph);

/**
 * Model with multiple ports
 */
const m1 = new shapes.devs.Model({
    position: {x: 80, y: 380},
    size: {width: 180, height: 180},
    inPorts: ['in1', 'in2', 'in3', 'in4'],
    outPorts: ['out1', 'out2', 'out3', 'out4'],
    attrs: {
        '.label': {text: 'Model', 'ref-x': .5, 'ref-y': .2},
        rect: {fill: '#5AB6FF'}
    }
});

graph.addCell(m1);

generateCells(graph);

/**
 * An example showing how to collapse/expand elements in jointjs
 *
 * URL: https://jsfiddle.net/vsd21my5/5/
 */

$("#zoom-in-btn").on('click', () => {
    const scale = paper.scale();
    const newScaleX = scale.sx + 0.05;
    const newScaleY = scale.sy + 0.05;
    if (newScaleX >= 0.2 && newScaleX <= 2) paper.scale(newScaleX, newScaleY);
});

$("#zoom-out-btn").on('click', () => {
    const scale = paper.scale();
    const newScaleX = scale.sx - 0.05;
    const newScaleY = scale.sy - 0.05;
    if (newScaleX >= 0.2 && newScaleX <= 2) paper.scale(newScaleX, newScaleY);
});

$("#zoom-reset-btn").on('click', () => {
    paper.scale(0.7, 0.7);
});

