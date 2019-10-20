import {
    concat as _concat,
    isFunction as _isFunction, isUndefined as _isUndefined
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
            '.body': {stroke: '#ffffff'},
        },
    }, shapes.devs.Coupled.prototype.defaults);

    /**
     * @private
     * @type {DiagramTitle.Element}
     */
    let diagramTitle = null;

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
        if (_isUndefined(this.get('simpleRowList'))) this.prop('simpleRowList', []);

        this.get('simpleRowList').push(row);
    };

    /**
     *
     * @param {ObjectRow.Element} row
     */
    const addObjectRow = function (row) {
        if (_isUndefined(this.get('objectRowList'))) this.prop('objectRowList', []);

        this.get('objectRowList').push(row);
    };

    const getSimpleRowList = function () {
        return this.get('simpleRowList');
    };

    const getObjectRowList = function () {
        return this.get('objectRowList');
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