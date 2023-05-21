import OptionsTanks from "../components/OptionsTanks.tsx";
import Navigator from "../layout/Navigator.tsx";
import Footer from "../layout/Footer.tsx";
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