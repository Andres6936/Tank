import Konva from "konva";
import { getRotationCoordinates } from "~/pdf/utility/rotation";

const getConsecutiveUUID = () => {
    const UUID7 = Bun.randomUUIDv7().toUpperCase();
    const [first, ...rest] = UUID7.split('-')
    const shortUUID = (first + '-' + rest.at(-1))

    return {
        short: shortUUID,
        long: UUID7,
    }
}

const getCircleTextBuffer = (uuid: string) => {
    const stage = new Konva.Stage({
        width: 500,
        height: 500,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const radius = 150;
    const circlePath = `M ${250 - radius},250 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`;


    const textPath = new Konva.TextPath({
        x: 0,
        y: 0,
        fill: 'white',
        fontSize: 20,
        fontFamily: 'monospace',
        data: circlePath,
        text: `Firmado electrónicamente por Escriba - ${uuid} - `,
        align: 'center',
    });

    layer.add(textPath);

    // This block of code is used to center the text (as image)
    // over the origin center, avoiding the unaligned text
    const {rotation, dx, dy} = getRotationCoordinates(layer, 6)
    // The value of 6 is magic, is needed to see the text align
    // with the UUID
    // See https://github.com/konvajs/konva/issues/26 for more details
    layer.rotation(rotation)
    layer.x(layer.x() + dx)
    layer.y(layer.y() + dy)

    return stage.toDataURL();
}

export {
    getConsecutiveUUID,
    getCircleTextBuffer,
}