import * as joint from 'jointjs';


export default Paper = function (paperDivElement) {
    return new joint.dia.Paper({
        el: paperDivElement,
        width: '100%', 
        height: 800,
        gridSize: 1,
        model: graph,
        cellViewNamespace: joint.shapes,
    });
};