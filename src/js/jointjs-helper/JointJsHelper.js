import { dia, shapes, linkTools } from 'jointjs';
import CustomElement from '../schema-diagram/common/CustomHtmlElement';
import simpleRowTemplate from "../schema-diagram/simple-row/SimpleRow.html";
import diagramTitleTemplate from "../schema-diagram/diagram-title/DiagramTitle.html";

const verticesTool = new linkTools.Vertices();
const segmentsTool = new linkTools.Segments();
const sourceArrowheadTool = new linkTools.SourceArrowhead();
const targetArrowheadTool = new linkTools.TargetArrowhead();
const sourceAnchorTool = new linkTools.SourceAnchor();
const targetAnchorTool = new linkTools.TargetAnchor();
const boundaryTool = new linkTools.Boundary();
const removeButton = new linkTools.Remove();

const getPosition = function (options) {
    return { x: options.x, y: options.y };
};

const getSize = function (options) {
    return { width: options.width, height: options.height };
};

export const portOptions = {
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
 * Creates a new link for the given source and target elements. The new link connects two ports:
 * sourcePort and targetPort
 *  
 * @param {string} sourceId 
 * @param {string} sourcePort 
 * @param {string} targetId 
 * @param {string} targetPort 
 * @param {string} label 
 * @return {shapes.standard.Link} a new link
 */
export const createLink = function createLink(sourceId, sourcePort, targetId, targetPort, labelText, cardinalityLabel) {
    /**
     * Use link tools to add segments, points and other link control
     * elements to the link. 
     * 
     * Tutorial: https://resources.jointjs.com/tutorial/link-tools
     */
    var link = new dia.Link({
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } },
        // router: { name: 'manhattan' },
        connector: { name: 'rounded' },
        source: {
            id: sourceId,
            port: sourcePort
        },
        target: {
            id: targetId,
            port: targetPort
        },
    });

    link.appendLabel({
        attrs: {
            text: {
                text: labelText || 'REF'
            },
            line: {
                strokeWidth: 2,
            }
        },
        position: {
            offset: 15
        }
    });

    if (cardinalityLabel != null) link.appendLabel(cardinalityLabel);

    return link;
};

export const createPaper = function createPaper(paperDivElement, graph) {
    const defaultLink = new dia.Link({
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
    });

    defaultLink.appendLabel({
        attrs: {
            text: {
                text: 'REF'
            }
        }
    });

    return new dia.Paper({
        el: paperDivElement,
        width: '100%',
        height: 800,
        gridSize: 1,
        model: graph,
        cellViewNamespace: shapes,
        defaultLink: defaultLink,
        validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
            // Prevent linking from input ports.
            if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
            // Prevent linking from output ports to input ports within one element.
            if (cellViewS === cellViewT) return false;
            // Prevent linking to input ports.
            return magnetT && magnetT.getAttribute('port-group') === 'in';
        },
        snapLinks: { radius: 75 },
        markAvailable: true
    });
};

export const createCoupled = function createCoupled(options) {
    return new shapes.devs.Coupled({
        attrs: { text: { text: options.text } },
        position: getPosition(options),
        size: getSize(options),
        attrs: {
            rect: { stroke: '#ffffff', 'stroke-width': 1 }
        }
    });
};

export const createCustomElement = function createCustomElement(options) {
    return new CustomElement.Element({
        template: options.template,
        customAttrs: {
            entity_title: options.title
        },
        position: getPosition(options),
        size: getSize(options)
    });
};


export const createExampleDiagrams = function (graph, paper) {
    var c1 = createCoupled({ text: 'CUSTOMER', x: 50, y: 15, width: 400, height: 140 });

    var t1 = createCustomElement({ title: 'CUSTOMER', template: diagramTitleTemplate, x: 50, y: 15, width: 400, height: 145 });

    // console.log(t1.get('id'));

    var sr1 = new CustomElement.Element({
        template: simpleRowTemplate,
        customAttrs: {
            field_name: 'id',
            field_constraints: 'ID, req, unq, idx',
            field_date_type: 'str'
        },
        size: { width: 400, height: 35 },
        position: { x: 50, y: 50 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr2 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'password',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: { x: 50, y: 85 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr3 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'email',
            field_constraints: 'req, unq, idx',
            field_date_type: 'str',
        },
        position: { x: 50, y: 120 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    c1.embed(t1);
    c1.embed(sr1);
    c1.embed(sr2);
    c1.embed(sr3);

    var c2 = new shapes.devs.Coupled({
        attrs: { text: { text: 'ORDER' } },
        position: { x: 700, y: 15 },
        size: { width: 400, height: 195 },
        attrs: {
            rect: { stroke: '#ffffff', 'stroke-width': 1 }
        }
    });

    var t2 = new CustomElement.Element({
        template: diagramTitleTemplate,
        customAttrs: {
            entity_title: "ORDER"
        },
        position: { x: 700, y: 15 },
        size: { width: 400, height: 180 }
    });

    var sr21 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'id',
            field_constraints: 'ID, req, unq, idx',
            field_date_type: 'str',
        },
        position: { x: 700, y: 50 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr22 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'created_on',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: { x: 700, y: 85 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr23 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'user_id',
            field_constraints: 'REF, req',
            field_date_type: 'str',
        },
        position: { x: 700, y: 120 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr24 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'items',
            field_constraints: 'REF',
            field_date_type: 'arr',
        },
        position: { x: 700, y: 155 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });


    c2.embed(t2);
    c2.embed(sr21);
    c2.embed(sr22);
    c2.embed(sr23);
    c2.embed(sr24);

    var c3 = createCoupled({ text: 'ITEM', x: 1300, y: 15, width: 400, height: 175 });

    var t3 = createCustomElement({ title: 'ITEM', template: diagramTitleTemplate, x: 1300, y: 15, width: 400, height: 145 });

    // console.log(t3.get('id'));

    var sr31 = new CustomElement.Element({
        template: simpleRowTemplate,
        customAttrs: {
            field_name: 'id',
            field_constraints: 'ID, req, unq, idx',
            field_date_type: 'str'
        },
        size: { width: 400, height: 35 },
        position: { x: 1300, y: 50 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr32 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'name',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: { x: 1300, y: 85 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr33 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'description',
            field_constraints: 'req',
            field_date_type: 'str',
        },
        position: { x: 1300, y: 120 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
    });

    var sr34 = new CustomElement.Element({
        template: simpleRowTemplate,
        size: { width: 400, height: 35 },
        customAttrs: {
            field_name: 'price',
            field_constraints: 'req',
            field_date_type: 'num',
        },
        position: { x: 1300, y: 155 },
        inPorts: ['in'],
        outPorts: ['out'],
        ports: portOptions
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
        var cardianlityLabel = {
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
                offset: 15
            }
        };
        createLink(sr23.id, "in", sr1.id, "out", "REF", cardianlityLabel).addTo(graph).reparent();

        var cardianlityLabel2 = {
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
                offset: 15
            }
        };
        createLink(sr24.id, "out", sr31.id, "in", "REF", cardianlityLabel2).addTo(graph).reparent();

    } catch (error) {
        console.log(error);
    }
};