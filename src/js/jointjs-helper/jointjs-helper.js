import {dia, shapes, linkTools, util} from 'jointjs';
import {isUndefined, isNull} from 'lodash';
import SimpleRow from '../schema-diagram/simple-row/simple-row';
import DiagramTitle from '../schema-diagram/diagram-title/diagram-title';
import ObjectRow from "../schema-diagram/object-row/object-row";
import diagramTitleTemplate from "../schema-diagram/diagram-title/diagram-title.html";

const getPosition = (options) => {
    return {x: options.x, y: options.y};
};

const getSize = (options) => {
    return {width: options.width, height: options.height};
};

export const PORT_OPTIONS = {
    groups: {
        'in': {
            label: {
                position: {
                    name: 'right',
                }
            }
        },
        'out': {
            label: {
                position: {
                    name: 'left',
                }
            },
        }
    }
};

/**
 *
 * @returns {dia.Link}
 */
const createDefaultLink = function createDefaultLink() {
    const defaultLink = new dia.Link({
        attrs: {'.marker-target': {d: 'M 10 0 L 0 5 L 10 10 z'}},
        // router: { name: 'manhattan' },
        connector: {name: 'rounded'},
    });

    defaultLink.appendLabel({
        attrs: {
            text: {
                text: 'REF'
            }
        },
        position: {
            offset: 20
        }
    });

    return defaultLink;
};

/**
 * Creates a new link for the given source and target elements. The new link connects two ports:
 * sourcePort and targetPort
 *
 * @param {string} sourceId
 * @param {string} sourcePort
 * @param {string} targetId
 * @param {string} targetPort
 * @param {string} label
 * @return {dia.Link} a new link
 */
export const createLink = function createLink(sourceId, sourcePort, targetId, targetPort, labelText, cardinalityLabel) {
    const link = createDefaultLink()
        .router({name: 'manhattan'})
        .connector({name: 'rounded'})
        .source({
            id: sourceId,
            port: sourcePort
        })
        .target({
            id: targetId,
            port: targetPort
        });

    if (cardinalityLabel != null) link.appendLabel(cardinalityLabel);

    return link;
};

/**
 *
 * @returns {linkTools.Button}
 */
const createInfoButton = function createInfoButton() {
    return new linkTools.Button({
        markup: [{
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 11,
                'fill': '#0099ee',
                'cursor': 'pointer'
            }
        }, {
            tagName: 'path',
            selector: 'icon',
            attributes: {
                'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
                'fill': 'none',
                'stroke': '#FFFFFF',
                'stroke-width': 2,
                'pointer-events': 'none'
            }
        }],
        distance: -60,
        offset: 0,
        action: function (evt) {
            console.log('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id);
        }
    });
};

function validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    if (!linkView.hasTools()) linkView.addTools(new dia.ToolsView({tools: [createInfoButton()]}));

    // Prevent linking from input ports.
    // if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;

    // Prevent linking from output ports to input ports within one element.
    // if (cellViewS === cellViewT) return false;

    // Prevent linking to input ports.
    return magnetT; // && magnetT.getAttribute('port-group') === 'in';
}

function zoomOnMousewheel(paper, delta) {
    if (isNull(paper) || isUndefined(paper)) return;

    const scale = paper.scale();
    const newScaleX = scale.sx + (delta * 0.01);
    const newScaleY = scale.sy + (delta * 0.01);
    if (newScaleX >= 0.2 && newScaleX <= 2) paper.scale(newScaleX, newScaleY);
}

export const createPaper = function createPaper(paperDivElement, graph) {
    const paper = new dia.Paper({
        el: paperDivElement,
        width: '100%',
        height: '100%',
        gridSize: 1,
        model: graph,
        cellViewNamespace: shapes,
        defaultLink: createDefaultLink(),
        validateConnection: validateConnection,
        snapLinks: {radius: 75},
        markAvailable: true
    });

    let highlighted = false;
    paper.on({
        'blank:mousewheel': (event, x, y, delta) => {
            event.preventDefault();
            zoomOnMousewheel(paper, delta);
        },
        'cell:mousewheel': (_, event, x, y, delta) => {
            event.preventDefault();
            zoomOnMousewheel(paper, delta);
        },
        'link:pointerup': (linkView) => {
            if (linkView.hasTools()) return;
            linkView.addTools(new dia.ToolsView({tools: [createInfoButton()]}));
        },
        'link:mouseenter': (linkView) => {
            linkView.showTools();
        },
        'link:mouseleave': (linkView) => {
            linkView.hideTools();
        },
        'cell:pointerclick': (cellView) => {
            if (!(cellView instanceof dia.LinkView)) {
                return;
                /* highlighting disabled */
                if (highlighted) {
                    cellView.unhighlight();
                    highlighted = false;
                } else {
                    cellView.highlight();
                    highlighted = true;
                }
            }
        }
    });

    return paper;
};

export const addInfoButton = function addInfoButton(link, paper) {
    if (paper == null) return;

    const linkView = link.findView(paper);
    if (linkView == null) return;

    linkView.addTools(new dia.ToolsView({tools: [createInfoButton()]}));
    linkView.hideTools();
};

export const createCoupled = function createCoupled(options) {
    return new shapes.devs.Coupled({
        attrs: {text: {text: options.text}, rect: {stroke: '#ffffff', 'stroke-width': 1}},
        position: getPosition(options),
        size: getSize(options),
    });
};

export const createTitleRow = function createTitleRow(options) {
    return new DiagramTitle.Element({
        customAttrs: {
            entity_title: options.title
        },
        position: getPosition(options),
        size: getSize(options)
    });
};

export const createSimpleRow = function createSimpleRow(options) {
    return new SimpleRow.Element({

        customAttrs: {
            field_name: options.field_name,
            field_constraints: options.field_constraints || 'ID, req, unq, idx',
            field_date_type: options.field_date_type || 'str'
        },
        size: {width: options.width || 0, height: options.height || 0},
        position: {x: options.x || 0, y: options.y || 0},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });
};


export const createDummyDiagrams = function (graph) {
    const c1 = createCoupled({text: 'Customer', x: 50, y: 15, width: 400, height: 140});

    const t1 = createTitleRow({
        title: 'Customer',
        template: diagramTitleTemplate,
        x: 50, y: 15,
        width: 400, height: 35
    });

    const sr1 = new SimpleRow.Element({

        customAttrs: {
            field_name: 'id',
            field_constraints: 'ID, req, unq, idx',
            field_date_type: 'str'
        },
        size: {width: 400, height: 36},
        position: {x: 50, y: 50},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const sr2 = new SimpleRow.Element({

        size: {width: 400, height: 36},
        customAttrs: {
            field_name: 'password',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: {x: 50, y: 85},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const sr3 = new SimpleRow.Element({

        size: {width: 400, height: 36},
        customAttrs: {
            field_name: 'email',
            field_constraints: 'req, unq, idx',
            field_date_type: 'str',
        },
        position: {x: 50, y: 120},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    c1.embed(t1);
    c1.embed(sr1);
    c1.embed(sr2);
    c1.embed(sr3);
    c1.position({x: 55, y: 255});

    const c2 = new shapes.devs.Coupled({
        attrs: {
            text: {text: 'Order'},
            rect: {stroke: '#ffffff', 'stroke-width': 1}
        },
        position: {x: 700, y: 15},
        size: {width: 400, height: 175},
    });

    const t2 = createTitleRow({title: 'Order', template: diagramTitleTemplate, x: 700, y: 15, width: 400, height: 35});

    const sr21 = new SimpleRow.Element({

        size: {width: 400, height: 35},
        customAttrs: {
            field_name: 'id',
            field_constraints: 'ID, req, unq, idx',
            field_date_type: 'str',
        },
        position: {x: 700, y: 50},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const sr22 = new SimpleRow.Element({

        size: {width: 400, height: 35},
        customAttrs: {
            field_name: 'created_on',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: {x: 700, y: 85},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const sr23 = new SimpleRow.Element({

        size: {width: 400, height: 35},
        customAttrs: {
            field_name: 'user_id',
            field_constraints: 'REF, req',
            field_date_type: 'str',
        },
        position: {x: 700, y: 120},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const sr24 = new ObjectRow.Element({

        size: {width: 400, height: 35},
        isObjectRow: true,
        customAttrs: {
            field_name: 'items',
            field_constraints: 'REF',
            field_date_type: 'arr',
        },
        position: {x: 700, y: 155},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });


    c2.embed(t2);
    c2.embed(sr21);
    c2.embed(sr22);
    c2.embed(sr23);
    c2.embed(sr24);

    const c3 = createCoupled({text: 'Item', x: 1300, y: 15, width: 400, height: 175});

    const t3 = createTitleRow({title: 'Item', template: diagramTitleTemplate, x: 1300, y: 15, width: 400, height: 35});

    // console.log(t3.get('id'));

    const sr31 = new SimpleRow.Element({

        customAttrs: {
            field_name: 'id',
            field_constraints: 'ID, req, unq, idx',
            field_date_type: 'str'
        },
        size: {width: 400, height: 35},
        position: {x: 1300, y: 50},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const sr32 = new SimpleRow.Element({

        size: {width: 400, height: 35},
        customAttrs: {
            field_name: 'name',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: {x: 1300, y: 85},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const sr33 = new SimpleRow.Element({

        size: {width: 400, height: 35},
        customAttrs: {
            field_name: 'description',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: {x: 1300, y: 120},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const sr34 = new SimpleRow.Element({

        size: {width: 400, height: 35},
        customAttrs: {
            field_name: 'price',
            field_constraints: 'req',
            field_date_type: 'num',
        },
        position: {x: 1300, y: 155},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    c3.embed(t3);
    c3.embed(sr31);
    c3.embed(sr32);
    c3.embed(sr33);
    c3.embed(sr34);


    graph.addCells([c1, t1, sr1, sr2, sr3, c2, t2, sr21, sr22, sr23, sr24, c3, t3, sr31, sr32, sr33, sr34]);

    c1.toFront();
    c2.toFront();
    c3.toFront();

    try {
        const cardianlityLabel = {
            attrs: {
                text: {
                    text: '1:1'
                },
                line: {
                    strokeWidth: 2,
                }
            },
            position: {
                distance: 20,
                offset: 20
            }
        };
        createLink(sr23.id, "in", sr1.id, "out", "REF", cardianlityLabel).addTo(graph).reparent();

        const cardinalityLabel2 = {
            attrs: {
                text: {
                    text: '1:N'
                },
                line: {
                    strokeWidth: 2,
                }
            },
            position: {
                distance: 20,
                offset: 20
            }
        };
        createLink(sr24.id, "out", sr31.id, "in", "REF", cardinalityLabel2).addTo(graph).reparent();

    } catch (error) {
        console.log(error);
    }
};