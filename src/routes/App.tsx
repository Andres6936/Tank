import WaterTank from "../components/WaterTank.tsx";
import Footer from "../layout/Footer.tsx";
import Navigator from "../layout/Navigator.tsx";
import MainContainer from "../layout/MainContainer.tsx";
import OptionsTanks from "../components/OptionsTanks.tsx";

export default function App() {
  return (
    <main className="p:0 m:0 h:100dvh w:100vw overflow:hidden@xs flex flex-col font:sans">
      <Navigator />
      <MainContainer>
        <WaterTank />
        <OptionsTanks />
      </MainContainer>
      <Footer />
    </main>
  );
}
