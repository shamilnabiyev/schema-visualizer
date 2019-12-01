import {shapes, util} from 'jointjs';
import isNil from 'lodash/isNil';

const Supertype = shapes.html.Supertype = {};

Supertype.Element = shapes.devs.Coupled.extend((function () {
    let defaults = util.defaultsDeep({
        type: 'html.Supertype.Element',
        attrs: {
            '.body': {stroke: '#aaaaaa'},
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
     * @param {DiagramRoot.Element} subtype
     */
    const addSubtype = function (subtype) {
        if (isNil(this.get('subtypeList'))) this.prop('subtypeList', []);
        this.get('subtypeList').push(subtype);
    };

    const getSubtypeList = function () {
        if (isNil(this.get('subtypeList'))) this.prop('subtypeList', []);
        return this.get('subtypeList');
    };

    return {
        defaults: defaults,
        setDiagramTitle: setDiagramTitle,
        getDiagramTitle: getDiagramTitle,
        addSubtype: addSubtype,
        getSubtypeList: getSubtypeList
    };
})());

export default Supertype;