const requester = require('./requester');

class Notificador {

    constructor(){
        this.requester = new requester.Requester()
    }

    notificarNuevoAlbum( artist, album ){
        let notificacion = {
                            artistId: artist.id,
                            subject: `Nuevo album para el artista ${artist.name}`,
                            message: `Se ha agregado el album ${album.name} al artista ${artist.name}`,
                            from: 'UNQfy <UNQfy.notifications@gmail.com>'
                            }

        this.requester.requestNuevoAlbum( notificacion )
    }

    notificarArtistaBorrado( artistaId ){
        this.requester.requestBorrarSubscripcion( artistaId )
    }

}

module.exports = {
    Notificador
  };
