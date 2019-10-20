import {
    concat as _concat,
    isFunction as _isFunction
} from 'lodash';
import {shapes, util} from 'jointjs';

const DiagramRoot = shapes.html.DiagramRoot = {};

DiagramRoot.Element = shapes.devs.Coupled.extend((function () {
    const model = this;

    /**
     * Default attributes
     * @type {object}
     */
    let defaults = util.defaultsDeep({
        type: 'html.DiagramRoot.Element',
        attrs: {
            '.body': { stroke: '#ffffff' },
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

    const getSimpleRowList = function () {
        return simpleRowList;
    };

    const getObjectRowList = function () {
        return objectRowList;
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
        addSimpleRow: addSimpleRow,
        addObjectRow: addObjectRow,
        setDiagramTitle: setDiagramTitle,
        getSimpleRowList: getSimpleRowList,
        getObjectRowList: getObjectRowList
    };
})());

export default DiagramRoot;