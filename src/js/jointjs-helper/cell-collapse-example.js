var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({
    el: document.getElementById('paper'),
    model: graph,
    defaultConnectionPoint: {
        name: 'boundary'
    },
    defaultAnchor: {
        name: 'center'
    }
});

var Group = joint.dia.Element.define('example.Group', {
    size: {
        width: 100,
        height: 40
    },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: 'white',
            stroke: 'black',
            strokeWidth: 2
        },
        tool: {
            r: 10,
            cx: 20,
            cy: 20,
            fill: 'white',
            stroke: 'blue',
            strokeWidth: 2,
            cursor: 'pointer',
            event: 'element:collapse'
        }
    }
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body'
    }, {
        tagName: 'circle',
        selector: 'tool'
    }]
});

// Setup

var e1 = new Group();
e1.position(50, 50);
var a1 = new joint.shapes.standard.Rectangle();
var a2 = new joint.shapes.standard.Rectangle();
a1.size(50, 50);
a2.size(70, 30);
var l1 = new joint.shapes.standard.Link();
l1.source(a1).target(a2);
graph.addCells([e1, a1, a2, l1]);
e1.embed(a1);
e1.embed(a2);
a1.position(20, 10, {
    parentRelative: true
});
a2.position(90, 30, {
    parentRelative: true
});
e1.fitEmbeds({
    padding: {
        top: 40,
        left: 10,
        right: 10,
        bottom: 10
    }
});

var e2 = new Group();
e2.position(300, 300);
var a3 = new joint.shapes.standard.Rectangle();
var a4 = new joint.shapes.standard.Rectangle();
a3.size(50, 50);
a4.size(70, 30);
var l2 = new joint.shapes.standard.Link();
l2.source(a3).target(a4);
graph.addCells([e2, a3, a4, l2]);
e2.embed(a3);
e2.embed(a4);
a3.position(20, 10, {
    parentRelative: true
});
a4.position(90, -20, {
    parentRelative: true
});
e2.fitEmbeds({
    padding: {
        top: 40,
        left: 10,
        right: 10,
        bottom: 10
    }
});
toggleCollapse(e2);

var l = new joint.shapes.standard.Link();
l.source(e1).target(e2);
l.addTo(graph);

// Collapse / Expand
function toggleCollapse(group) {
    var graph = group.graph;
    if (!graph) return;
    var embeds;
    if (group.get('collapsed')) {
        group.transition('size/height', 150, {
            delay: 100,
            duration: 300,
        });
        group.transition('size/width', 160, {
            delay: 100,
            duration: 300,
        });

        group.on('transition:end', function (element, pathToAttribute) {
            if (group.get('collapsed')) return;
            // EXPAND
            var subgraph = group.get('subgraph');
            // deserialize subgraph
            var tmpGraph = new joint.dia.Graph();
            tmpGraph.addCells(subgraph);
            embeds = tmpGraph.getCells();
            tmpGraph.removeCells(embeds);
            // set relative position to parent
            embeds.forEach(function (embed) {
                if (embed.isLink()) return;
                var diff = embed.position().offset(group.position());
                embed.position(diff.x, diff.y);
            });
            graph.addCells(embeds);
            embeds.forEach(function (embed) {
                if (embed.isElement()) {
                    group.embed(embed);
                } else {
                    embed.reparent();
                }
            });

            group.attr('tool/stroke', 'blue');
            /*
            group.fitEmbeds({
              padding: {
                top: 40,
                left: 10,
                right: 10,
                bottom: 10
              }
            });
            */
        });
        group.set('collapsed', false);


    } else {

        // COLLAPSE
        embeds = graph.getSubgraph(group.getEmbeddedCells());
        embeds.sort(function (a) {
            return a.isLink() ? 1 : -1;
        });
        graph.removeCells(embeds);
        // get relative position to parent
        embeds.forEach(function (embed) {
            if (embed.isLink()) return;
            var diff = embed.position().difference(group.position());
            embed.position(diff.x, diff.y);
        });
        // serialize subgraph
        group.set('subgraph', embeds.map(function (embed) {
            return embed.toJSON();
        }));
        // group.resize(100, 100);
        group.set('collapsed', true);
        // group.size(100, 40);

        group.set('collapsed', true);

        group.transition('size/height', 40, {
            delay: 100,
            duration: 300,
        });
        group.transition('size/width', 100, {
            delay: 100,
            duration: 300,
        });

        group.attr('tool/stroke', 'red');
    }
}

// event handler for task group button
paper.on('element:collapse', function (elementView, evt) {
    evt.stopPropagation();
    toggleCollapse(elementView.model);
});
