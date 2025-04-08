import "./Home.css";
import FileCard from "../../Components/FileCard";

function Home() {
  return (
    <div
      style={{ backgroundColor: "#121212", height: "100vh", padding: "30px" }}
    >
      <FileCard
        user="Manuel"
        publicKeyECC="043aa7e23a...ecc"
        publicKeyRSA="b7340f8c9a...rsa"
      />
    </div>
  );
}

export default Home;
