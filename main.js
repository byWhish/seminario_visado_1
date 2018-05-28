

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');
let generos
function procesarParametros(parametros){
  unqfy = getUNQfy("./estado.json");
  switch (parametros[0]){
    case "addArtist":
      unqfy.addArtist({name:parametros[1],country:parametros[2]});
    break;
    case "addAlbum":
      let artist = parametros[1];
      unqfy.addAlbum(artist, {name:parametros[2],year:parametros[3]});
    break;
    case "addTrack":
      let album = parametros[1];
      unqfy.addTrack(album, {name:parametros[2],duration:parametros[3],genres:parametros[4]});
    break;
    case "addPlaylist":
      unqfy.addPlaylist(parametros[1],parametros[2],parametros[3]);
    break;
    case "populateAlbumsForArtist":
    unqfy.populateAlbumsForArtist(parametros[1],parametros[2],parametros[3]);
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


