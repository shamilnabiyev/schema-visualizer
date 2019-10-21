import {dia} from 'jointjs';
import HierarchyBase from "./hierarchy-base";
import {renderBox, updateBox, removeBox, initializeBox} from '../utils';

HierarchyBase.ElementView = dia.ElementView.extend({
    initialize: initializeBox,
    render: renderBox,
    updateBox: updateBox,
    removeBox: removeBox
});

export default HierarchyBase;