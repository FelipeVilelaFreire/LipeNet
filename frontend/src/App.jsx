import Header from './components/Header';
import UploadForm from './components/UploadForm'; // Importamos nosso novo formulário

function App() {
  return (
    <div>
      <Header />
      <main>
        <UploadForm />
      </main>
    </div>
  );
}

export default App;