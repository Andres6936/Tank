import Konva from "konva";

const DEG_TO_GRAD = Math.PI / 180

const getRotatePoint = ({x, y}: { x: number, y: number }, deg: number) => {
    const rcos = Math.cos(deg * DEG_TO_GRAD), rsin = Math.sin(deg * DEG_TO_GRAD)
    return {x: x * rcos - y * rsin, y: y * rcos + x * rsin}
}

const getRotationCoordinates = (node: Konva.Node, rotation: number) => {
    // Current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
    const displayedWidth = node.width() * node.scaleX();
    const displayedHeight = node.height() * node.scaleY();
    const topLeft = {x: -displayedWidth / 2, y: -displayedHeight / 2}

    const current = getRotatePoint(topLeft, node.rotation())
    const rotated = getRotatePoint(topLeft, rotation)
    const dx = rotated.x - current.x, dy = rotated.y - current.y

    return {
        rotation,
        dx,
        dy,
    }
}

export {
    getRotationCoordinates,
}