

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

function procesarParametros(parametros){
  unqfy = getUNQfy("./estado.json");
  switch (parametros[0]){
    case "addArtist":
      unqfy.addArtist(parametros[1],parametros[2]);
    break;
    case "addAlbum":
      unqfy.addAlbum(parametros[1],parametros[2]);
    break;
    case "addTrack":
      unqfy.addTrack(parametros[1],parametros[2],parametros[3]);
    break;
    case "addAlbum":
      unqfy.addPlaylist(parametros[1],parametros[2],parametros[3]);
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
  console.log(typeof(parametros[0])); 
}

main();


