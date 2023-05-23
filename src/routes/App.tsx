import WaterTank from "../components/WaterTank.tsx";
import Footer from "../layout/Footer.tsx";
import Navigator from "../layout/Navigator.tsx";
import MainContainer from "../layout/MainContainer.tsx";

export default function App() {
    return (
        <>
            <Navigator/>

            <MainContainer>
                <WaterTank/>
            </MainContainer>

            <Footer/>
        </>
    )
}