/* Import the core libs */
import $ from 'jquery';
import { dia, shapes } from 'jointjs';
import 'bootstrap/dist/js/bootstrap.bundle';
import './sb-admin-2.js';
import './fontAwesomeCustom.js';
/* Import the custom classes */
import generatetCells from "./jointjs-helper/DiagramGenerator";
import { addInfoButton, createPaper, createDummyDiagrams } from './jointjs-helper/JointJsHelper';
// import './diagram/HtmlElement/HtmlElement';
/* Import the styles */
import 'typeface-nunito';
import 'fontawesome_min_css';
import 'fontawesome_solid_min_css';
import 'jointjs_min_css';
import '../scss/index.scss';

$(window).on("load", () => {
    $('#loading-icon').remove();
    $('#wrapper').css("visibility", "initial");
});

var graph = new dia.Graph();

var paper = createPaper($('#paper-html-elements'), graph);
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

graph.addCell(generatetCells.root);
graph.addCells(generatetCells.child);

generatetCells.root.toFront();

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

