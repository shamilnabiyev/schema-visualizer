import {dia, shapes} from 'jointjs';
import CustomElement from '../schema-diagram/common/CustomHtmlElement';

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

export const createLink = function (source, sourcePort, target, targetPort, label) {
    var link = new shapes.standard.Link({
        router: { name: 'manhattan' },
        connector: { name: 'rounded' },
        source: {
            id: source.id,
            port: sourcePort
        },
        target: {
            id: target.id,
            port: targetPort
        }
    });

    link.appendLabel({
        attrs: {
            text: {
                text: label || 'REF'
            },
            line: {
                strokeWidth: 4,
            }
        },
        body: {
            ref: 'label',
            fill: '#ffffff',
            stroke: 'red',
            strokeWidth: 2,
            refR: 1,
            refCx: 0,
            refCy: 0
        },
    });

    return link;
};

export const createPaper = function (paperDivElement, graph) {
    return new dia.Paper({
        el: paperDivElement,
        width: '100%',
        height: 800,
        gridSize: 1,
        model: graph,
        cellViewNamespace: shapes,
    });
};

export const createCoupled = function (options) {
    return new shapes.devs.Coupled({
        attrs: { text: { text: options.text } },
        position: getPosition(options),
        size: getSize(options),
        attrs: {
            rect: { stroke: '#ffffff', 'stroke-width': 1 }
        }
    });
};

export const createCustomElement = function (options) {
    return new CustomElement.Element({
        template: options.template,
        customAttrs: {
            entity_title: options.title
        },
        position: getPosition(options),
        size: getSize(options)
    });
};