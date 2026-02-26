import WaterTank from "../components/WaterTank.tsx";
import Footer from "../layout/Footer.tsx";
import Navigator from "../layout/Navigator.tsx";
import MainContainer from "../layout/MainContainer.tsx";

export default function App() {
  return (
    <main className="p:0 m:0 h:100dvh w:100vw overflow:hidden">
      <Navigator />

      <MainContainer>
        <WaterTank />
      </MainContainer>

      <Footer />
    </main>
  );
}
