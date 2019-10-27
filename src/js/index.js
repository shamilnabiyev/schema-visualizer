/* Import the core libs */
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import './ui-script.js';
import './font-awesome-custom.js';
import './json-editor';
/* Import the custom classes */
import {getPaper} from "./jointjs-helper/diagram-generator";
import 'typeface-nunito';
import 'jointjs/dist/joint.min.css';
import 'jsoneditor/dist/jsoneditor.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '../scss/index.scss';

$(window).on("load", () => {
    $('#loading-icon').remove();
    $('#wrapper').css("visibility", "initial");
});

/**
 * An example showing how to collapse/expand elements in jointjs
 *
 * URL: https://jsfiddle.net/vsd21my5/5/
 */
const paper = getPaper();

$("#zoom-in-btn").on('click', () => {
    if(!paper) return;

    const scale = paper.scale();
    const newScaleX = scale.sx + 0.05;
    const newScaleY = scale.sy + 0.05;
    if (newScaleX >= 0.2 && newScaleX <= 2) paper.scale(newScaleX, newScaleY);
});

$("#zoom-out-btn").on('click', () => {
    if(!paper) return;

    const scale = paper.scale();
    const newScaleX = scale.sx - 0.05;
    const newScaleY = scale.sy - 0.05;
    if (newScaleX >= 0.2 && newScaleX <= 2) paper.scale(newScaleX, newScaleY);
});

$("#zoom-reset-btn").on('click', () => {
    if(!paper) return;

    paper.scale(0.7, 0.7);
});


