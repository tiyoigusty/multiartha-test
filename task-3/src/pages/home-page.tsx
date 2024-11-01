import { Navbar } from "../components/navbar";

function Home() {
  return (
    <>
      <Navbar />
      <div className="w-full h-screen">
        <div className="h-full flex justify-center items-center">
          <h1 className="font-extrabold text-5xl">DASHBOARD USER</h1>
        </div>
      </div>
    </>
  );
}

export default Home;
