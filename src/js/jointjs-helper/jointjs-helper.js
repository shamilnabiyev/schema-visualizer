import {dia, shapes, linkTools, elementTools} from 'jointjs';
import {isUndefined, isNull, isFunction} from 'lodash';
import $ from 'jquery';
import SimpleRow from '../schema-diagram/simple-row/simple-row';
import DiagramTitle from '../schema-diagram/diagram-title/diagram-title';
import ObjectRow from "../schema-diagram/object-row/object-row";
import ObjectRowHeader from "../schema-diagram/object-row-header/object-row-header";
import DiagramRoot from "../schema-diagram/diagram-root";
import {openSchemaUpdateModal} from "../json-editor/json-editor";

const cardinalityUpdateModal = $('#update-cardinality-modal');
const cardinalityUpdateButton = $('#update-cardinality-btn');
const cardinalitySelection = $('#cardinality-selection');

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
        router: {name: 'manhattan'},
        connector: {name: 'rounded'},
        attrs: {'.marker-target': {d: 'M 10 0 L 0 5 L 10 10 z'}},
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
        action: function () {
            cardinalityUpdateModal.modal('show');
            cardinalitySelection.val('0..N');
            cardinalityUpdateButton.off('click');
            cardinalityUpdateButton.on('click', () => {
                let cardinalityLabel = {
                    attrs: {
                        text: {
                            text: cardinalitySelection.children('option:selected').val() || '0..N'
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
                this.model.appendLabel(cardinalityLabel);
                cardinalityUpdateModal.modal('hide');
            });
        }
    });
};

function validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    // if (!linkView.hasTools()) linkView.addTools(new dia.ToolsView({tools: [createInfoButton()]}));

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
        gridSize: 1,
        width: '100%',
        height: '100%',
        markAvailable: true,
        restrictTranslate: true,
        model: graph,
        el: paperDivElement,
        cellViewNamespace: shapes,
        snapLinks: {radius: 75},
        defaultAnchor: {name: 'center'},
        defaultConnectionPoint: {name: 'anchor'},
        defaultLink: createDefaultLink(),
        validateConnection: validateConnection,
    });

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
        'element:collapse': (elementView, evt) => {
            evt.stopPropagation();
            console.log('element:collapse');
        },
        'element:mouseover': (elementView) => {
            // if (elementView instanceof DiagramRoot.ElementView) // console.log(elementView);
        }
    });

    paper.scale(0.7, 0.7);

    graph.on('add', function (cell) {
        if (cell instanceof DiagramRoot.Element) {
            cell.findView(paper).addTools(new dia.ToolsView({
                tools: [
                    new elementTools.Remove({
                        x: 425,
                        y: -17.5,
                        markup: [{
                            tagName: 'circle',
                            selector: 'button',
                            attributes: {
                                'r': 11,
                                'fill': '#FF1D00',
                                'cursor': 'pointer'
                            }
                        }, {
                            tagName: 'path',
                            selector: 'icon',
                            attributes: {
                                'd': 'M -5 -5 5 5 M -5 5 5 -5',
                                'fill': 'none',
                                'stroke': '#FFFFFF',
                                'stroke-width': 3,
                                'pointer-events': 'none'
                            }
                        }]
                    }),
                    new elementTools.Button(
                        {
                            x: 425,
                            y: 17.5,
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
                            action: function () {
                                if(!isFunction(this.model.getSchema)) return;
                                openSchemaUpdateModal(this.model);
                            }
                        }
                    )
                ]
            }));
        }
    });

    return paper;
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
        rowLevel: options.rowLevel || 0,
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });
};

export const createObjectRow = function createObjectRow(options) {
    const objectRowHeader = new ObjectRowHeader.Element({
        customAttrs: {
            field_name: options.field_name || 'new_field',
            field_constraints: options.field_constraints || 'ID, req, unq, idx',
            field_date_type: options.field_date_type || 'obj'
        },
        rowLevel: options.rowLevel || 0,
        size: {width: options.width || 0, height: options.height || 0},
        position: {x: options.x || 0, y: options.y || 0},
        inPorts: ['in'],
        outPorts: ['out'],
        ports: PORT_OPTIONS
    });

    const objectRow = new ObjectRow.Element({
        attrs: {
            text: {text: options.field_name || 'new_object_row'}
        },
        isObjectRow: true,
        size: {width: options.width || 0, height: options.height || 0},
        position: {x: options.x || 0, y: options.y || 0},
        rowLevel: options.rowLevel || 0,
    });

    objectRow.prop('objectRowHeader', objectRowHeader);

    return objectRow;
};

export const createRect = function () {
  return new shapes.devs.Model();
};
