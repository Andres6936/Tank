import WaterTank from "./components/WaterTank.tsx";
import ControlTanks from "./components/ControlTanks.tsx";
import OptionsTanks from "./components/OptionsTanks.tsx";
import Footer from "./components/Footer.tsx";
import Navigator from "./components/Navigator.tsx";

export default function App() {
    return (
        <>
            <Navigator/>

            <main className="flex flex:wrap@sm flex:col flex:row@sm gap:0.5em gap:0.4em@sm my:0.5em px:0.5em">
                <WaterTank/>
                <ControlTanks/>
                <OptionsTanks/>
            </main>

            <Footer/>
        </>
    )
}