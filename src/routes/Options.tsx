import OptionsTanks from "../components/OptionsTanks.tsx";
import Navigator from "../components/Navigator.tsx";
import Footer from "../components/Footer.tsx";
import MainContainer from "../layout/MainContainer.tsx";

export default function Options() {
    return (
        <>
            <Navigator/>

            <MainContainer>
                <OptionsTanks/>
            </MainContainer>

            <Footer/>
        </>
    )
}