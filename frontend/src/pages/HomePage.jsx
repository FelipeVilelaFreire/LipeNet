import PhotoGallery from "../components/PhotoGallery"; // Note o '../' para voltar um nível

function HomePage() {
  return (
    <div>
      <h1>Galeria Principal</h1>
      {/* Aqui estamos assumindo que a lista de fotos é passada via props */}
      {/* Por enquanto vamos deixar vazio, App.jsx vai cuidar disso */}
    </div>
  );
}

export default HomePage;
