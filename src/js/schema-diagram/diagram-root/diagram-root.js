import {
    concat as _concat,
} from 'lodash';
import {shapes, util} from 'jointjs';

const DiagramRoot = shapes.html.DiagramRoot = {};

DiagramRoot.Element = shapes.devs.Coupled.extend((function () {
    /**
     * Default attributes
     * @type {object}
     */
    let defaults = util.defaultsDeep({
        type: 'html.DiagramRoot.Element',
        attrs: {
            '.body': { stroke: '#ff1733' },
        },
    }, shapes.devs.Coupled.prototype.defaults);

    /**
     * @private
     * @type {DiagramTitle.Element}
     */
    let diagramTitle = null;

    /**
     * @private
     * @type {[SimpleRow.Element]}
     */
    let simpleRowList = [];

    /**
     * @private
     * @type {[ObjectRow.Element]}
     */
    let objectRowList = [];

    /**
     *
     * @param {DiagramTitle.Element} title
     */
    const setDiagramTitle = function (title) {
      diagramTitle = title;
    };

    /**
     *
     * @param {SimpleRow.Element} row
     */
    const addSimpleRow = function (row) {
        simpleRowList = _concat(simpleRowList, row);
    };

    /**
     *
     * @param {ObjectRow.Element} row
     */
    const addObjectRow = function (row) {
        objectRowList = _concat(objectRowList, row);
    };

    /**
     * TODO: create the following attributes and their getter/setter methods
     * - arrayRowList
     * - multipleTypeRowList
     *
     * TODO: create the following methods
     * - removeSimpleRow: finds the row by id and removes it from the list 'simpleRowList'
     * - removeObjectRow: same as removeSimpleRow for objectRows
     */

    return {
        defaults: defaults,
        setDiagramTitle: setDiagramTitle,
        addSimpleRow: addSimpleRow,
        addObjectRow: addObjectRow
    };
})());

export default DiagramRoot;