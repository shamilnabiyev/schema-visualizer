import {dia, shapes} from 'jointjs';


export default Paper = function (paperDivElement) {
    return new dia.Paper({
        el: paperDivElement,
        width: '100%', 
        height: 800,
        gridSize: 1,
        model: graph,
        cellViewNamespace: shapes,
    });
};