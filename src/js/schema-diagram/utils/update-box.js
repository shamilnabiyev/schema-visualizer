const updateBox = function () {
    if (!this.paper) return;
    if (!this.$box) return;
    if (!this.$box.css) return;
    if (!this.getBBox) return;

    const bbox = this.getBBox({ useModelGeometry: true });
    const scale = this.paper.scale();

    this.$box.css({
        transform: `scale(${scale.sx},${scale.sy})`,
        transformOrigin: '0 0',
        width: bbox.width / scale.sx,
        height: bbox.height / scale.sy,
        left: bbox.x,
        top: bbox.y,
    });
};

export default updateBox;