import 'bootstrap/dist/js/bootstrap.bundle';
import './sb-admin-2.js';
import * as $ from 'jquery';
import * as _ from 'lodash';
import Backbone from 'backbone';
import * as joint from 'jointjs';

import 'jointjs_min_css';
import '../scss/index.scss';

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: document.getElementById('myholder'),
    model: graph,
    width: 1024,
    height: 800,
    gridSize: 1,
    cellViewNamespace: joint.shapes,
});

var rect = new joint.shapes.standard.Rectangle();
rect.position(100, 30);
rect.resize(100, 40);
rect.attr({
    body: {
        fill: 'blue'
    },
    label: {
        text: 'Hello',
        fill: 'white'
    }
});
rect.addTo(graph);

var rect2 = rect.clone();
rect2.translate(300, 0);
rect2.attr('label/text', 'World!');
rect2.addTo(graph);

var link = new joint.shapes.standard.Link();
link.source(rect);
link.target(rect2);
link.addTo(graph);