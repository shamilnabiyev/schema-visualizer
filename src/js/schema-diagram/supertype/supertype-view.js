import {dia} from 'jointjs';
import Supertype from "./supertype";
import {renderBox, updateBox, removeBox, initializeBox} from '../utils';

Supertype.ElementView = dia.ElementView.extend({
    initialize: initializeBox,
    render: renderBox,
    updateBox: updateBox,
    removeBox: removeBox
});

export default Supertype;