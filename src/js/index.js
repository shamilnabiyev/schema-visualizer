/* Import the core libs */
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import './ui-script.js';
import './font-awesome-custom.js';
import './json-editor/json-editor';
import './visual-schema-editor';
/* Import the custom classes */
import {
    getPaper,
    addMigCastDbDiagrams,
    addSpeciesDbDiagrams,
    addMovieLensDbSchemata,
    serializeDiagrams, deserializeDiagrams
} from "./jointjs-helper/diagram-generator";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jointjs/dist/joint.min.css';
import 'jsoneditor/dist/jsoneditor.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '../css/custom.css';
import '../css/custom-jointjs.css';
import '../css/schema-diagram.css';
import '../css/schema-editor.css';


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

$('#migcast-db-btn').on('click', addMigCastDbDiagrams);
$('#species-db-btn').on('click', addSpeciesDbDiagrams);
$('#movielens-db-btn').on('click', addMovieLensDbSchemata);
$('#serialization-btn').on('click', serializeDiagrams);
$('#deserialization-btn').on('click', deserializeDiagrams);