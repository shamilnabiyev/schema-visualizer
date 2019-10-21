import {shapes, util} from 'jointjs';
import HierarchyBase from "../common/hierarchy-base";

const DiagramRoot = shapes.html.DiagramRoot = {};

DiagramRoot.Element = HierarchyBase.Element.extend((function () {
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
    }, HierarchyBase.Element.prototype.defaults);

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

    return {
        defaults: defaults,
        setDiagramTitle: setDiagramTitle,
    };
})());

export default DiagramRoot;