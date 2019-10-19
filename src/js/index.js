/* Import the core libs */
import $ from 'jquery';
import {dia, shapes} from 'jointjs';
import 'bootstrap/dist/js/bootstrap.bundle';
import './ui-script.js';
import './font-awesome-custom.js';
/* Import the custom classes */
import generatedCells from "./jointjs-helper/diagram-generator";
import {addInfoButton, createPaper, createDummyDiagrams} from './jointjs-helper/jointjs-helper';
import 'typeface-nunito';
import 'fontawesome_min_css';
import 'fontawesome_solid_min_css';
import 'jointjs_min_css';
import '../scss/index.scss';
import {forEach as _forEach} from "lodash";
import DiagramRoot from "./schema-diagram/diagram-root/diagram-root";

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

// graph.addCell(generatedCells.root);
graph.addCells([generatedCells.rootCell, generatedCells.childCells]);

_forEach(generatedCells.childCells, (element, index) => {
    element.position(0, index * 35, {parentRelative: true});
});

generatedCells.rootCell.fitEmbeds();
generatedCells.rootCell.toFront();

const coupledParent = new shapes.devs.Coupled({
    attrs: {rect: {stroke: '#1E90FF', 'stroke-width': 3}},
    position: {x: 400, y: 300},
});

const coupledSubParent = new shapes.devs.Coupled();

const atomicChild1 = new shapes.devs.Atomic();

coupledSubParent.embed(atomicChild1);
coupledParent.embed(coupledSubParent);

graph.addCells([coupledParent, coupledSubParent, atomicChild1]);

coupledSubParent.position(10, 10, {parentRelative: true});
atomicChild1.position(10, 10, {parentRelative: true});
coupledParent.fitEmbeds({
    padding: {
        top: 50,
        right: 20,
        bottom: 20,
        left: 20
    },
    deep: true
});

const diagramRoot1 = new DiagramRoot.Element({
    attrs: {
        text: {text: 'Diagram Root'},
    },
    position: {x: 500, y: 500}
});
graph.addCell(diagramRoot1);

// console.log(coupledParent.getEmbeddedCells({deep: true}));

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

