

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

function procesarParametros(parametros){
  unqfy = getUNQfy("./estado.json");
  switch (parametros[0]){
    case "addArtist":
      unqfy.addArtist(JSON.parse(`{"name":"${parametros[1]}","country":"${parametros[2]}"}`));
    break;
    case "addAlbum":
      let artist = parametros.slice(1);
      unqfy.addAlbum(artist, JSON.parse(`{"name":"${parametros[1]}","year":"${parametros[2]}"}`));
    break;
    case "addTrack":
      let album = parametros.slice(1);
      unqfy.addTrack(parametros);
    break;
    case "addPlaylist":
      unqfy.addPlaylist(parametros);
    break;
    default: 
  }
  saveUNQfy(unqfy,"./estado.json");
}

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    console.log();
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

// Guarda el estado de UNQfy en filename
function saveUNQfy(unqfy, filename) {
  console.log();
  unqfy.save(filename);
}

function main() {
  //console.log('arguments: ');
  //process.argv.forEach(argument => console.log(argument));
  let parametros = process.argv.slice(2);
  procesarParametros(parametros);
}

main();


