
function Header(props) {
  return (
    <header>
      <h1>LipeNet</h1>
       <h1>Olá, {props.username}! Bem-vindo ao LipeNet.</h1>
      <p>Sua Galeria de Fotos Inteligente</p>
    </header>
  );
}

export default Header;