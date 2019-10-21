import {renderBox, updateBox, removeBox, initializeBox} from '../utils';
import DiagramRoot from "./diagram-root";
import HierarchyBase from "../common/hierarchy-base-view";


DiagramRoot.ElementView = HierarchyBase.ElementView.extend({
    initialize: initializeBox,
    render: renderBox,
    updateBox: updateBox,
    removeBox: removeBox
});

export default DiagramRoot;
