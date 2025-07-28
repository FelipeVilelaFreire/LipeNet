

function PhotoCard(props) {
  const { image, text, caption } = props.photo;

  return (
    <div style={{ border: '1px solid #eee', padding: '10px', margin: '10px', width: '250px' }}>
      {/* Usamos um placeholder caso a imagem não carregue */}
      <img src={image} alt={text} style={{ width: '100%' }} />
      <h4>{text}</h4>
      <p><em>Legenda da IA: {caption}</em></p>
    </div>
  );
}

export default PhotoCard;