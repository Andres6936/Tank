import {Font} from "@react-pdf/renderer";

Font.register({
    family: "Geist",
    fonts: [
        {
            src: './public/fonts/Geist-Light.ttf',
            fontWeight: "light"
        },
        {
            src: './public/fonts/Geist-Regular.ttf',
            fontWeight: "normal"
        },
        {
            src: './public/fonts/Geist-RegularItalic.ttf',
            fontStyle: "italic",
        },
        {
            src: './public/fonts/Geist-Bold.ttf',
            fontWeight: "bold"
        },
    ]
})

Font.register({
    family: "InstrumentSerif",
    fonts: [
        {
            src: './public/fonts/InstrumentSerif-Italic.ttf',
            fontWeight: "normal",
            fontStyle: "italic"
        },
        {
            src: './public/fonts/InstrumentSerif-Regular.ttf',
            fontWeight: "normal"
        }
    ]
})

Font.register({
    family: "Merriweather",
    fonts: [
        {
            src: './public/fonts/Merriweather_48pt-Regular.ttf',
            fontWeight: "normal",
        },
        {
            src: './public/fonts/Merriweather_48pt-Italic.ttf',
            fontWeight: "normal",
            fontStyle: "italic",
        },
        {
            src: './public/fonts/Merriweather_48pt-SemiBoldItalic.ttf',
            fontWeight: "semibold",
            fontStyle: "italic",
        },
    ]
})

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: './public/fonts/Roboto-Regular.ttf',
            fontWeight: "normal"
        },
    ]
})

Font.register({
    family: "RockSalt",
    fonts: [
        {
            src: './public/fonts/RockSalt-Regular.ttf',
            fontWeight: "normal"
        },
    ]
})

Font.register({
    family: "MonsieurLaDoulaise",
    fonts: [
        {
            src: './public/fonts/MonsieurLaDoulaise-Regular.ttf',
            fontWeight: "normal"
        },
    ]
})