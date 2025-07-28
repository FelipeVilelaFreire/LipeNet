import Header from './components/Header';
import UploadForm from './components/UploadForm'; // Importamos nosso novo formulário
import PhotoGallery from './components/PhotoGallery'

function App() {
  return (
    <div>
      <Header />
      <main>
        <UploadForm />
            <hr /> {/* Uma linha para separar */}
        <PhotoGallery />
      </main>
    </div>
  );
}

export default App;