import {dia} from 'jointjs';
import DiagramRoot from "./diagram-root";
import {renderBox, updateBox, removeBox, initializeBox} from '../utils';

DiagramRoot.ElementView = dia.ElementView.extend({
    initialize: initializeBox,
    render: renderBox,
    updateBox: updateBox,
    removeBox: removeBox
});

export default DiagramRoot;
