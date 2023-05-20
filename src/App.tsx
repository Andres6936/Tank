import WaterTank from "./components/WaterTank.tsx";
import ControlTanks from "./components/ControlTanks.tsx";
import OptionsTanks from "./components/OptionsTanks.tsx";
import Footer from "./components/Footer.tsx";
import Navigator from "./components/Navigator.tsx";

export default function App() {
    return (
        <>
            <Navigator/>

            <main className="flex flex:col">
                <WaterTank/>
                <ControlTanks/>
                <OptionsTanks/>
            </main>

            <Footer/>
        </>
    )
}