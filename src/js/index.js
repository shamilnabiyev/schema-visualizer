/* Import the core libs */
import $ from 'jquery';
import {dia, shapes, elementTools} from 'jointjs';
import 'bootstrap/dist/js/bootstrap.bundle';
import './ui-script.js';
import './font-awesome-custom.js';
import './json-editor';
/* Import the custom classes */
import generateCells from "./jointjs-helper/diagram-generator";
import {createPaper} from './jointjs-helper/jointjs-helper';
import 'typeface-nunito';
import 'jointjs/dist/joint.min.css';
import 'jsoneditor/dist/jsoneditor.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '../scss/index.scss';
import DiagramRoot from "./schema-diagram/diagram-root";

$(window).on("load", () => {
    $('#loading-icon').remove();
    $('#wrapper').css("visibility", "initial");
});

const graph = new dia.Graph();

const paper = createPaper($('#paper-html-elements'), graph);
// paper.scale(0.7, 0.7);


// createDummyDiagrams(graph);

/**
 * Model with multiple ports
 */
const m1 = new shapes.devs.Model({
    position: {x: 850, y: 50},
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


