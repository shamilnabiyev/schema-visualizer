import {
    isUndefined as _isUndefined
} from 'lodash';
import {shapes, util} from 'jointjs';

const HierarchyBase = shapes.html.HierarchyBase = {};
/**
 * typedef {joint.devs.Couple} HierarchyBase.Element
 */

/**
 * @class
 * @extends shapes.devs.Coupled
 */
HierarchyBase.Element = shapes.devs.Coupled.extend((function () {
    const model = this;

    /**
     * Default attributes
     * @type {object}
     */
    let defaults = util.defaultsDeep({
        type: 'html.HierarchyBase.Element',
        attrs: {
            '.body': {stroke: '#ffffff'},
        },
    }, shapes.devs.Coupled.prototype.defaults);

    /**
     *
     * @param {DiagramTitle.Element} title
     */
    const setDiagramTitle = function (title) {
        this.prop('diagramTitle', title);
    };

    const getDiagramTitle = function () {
        return this.prop('diagramTitle');
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

    const simpleRowListLength = function () {
        return this.get('simpleRowList').length;
    };

    const objectRowListLength = function () {
        return this.get('objectRowList').length;
    };

    const removeChildCells = function () {
        this.prop('simpleRowList', []);
        this.prop('objectRowList', []);
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
        getDiagramTitle: getDiagramTitle,
        getSimpleRowList: getSimpleRowList,
        getObjectRowList: getObjectRowList,
        removeChildCells: removeChildCells
    };
})());

export default HierarchyBase;