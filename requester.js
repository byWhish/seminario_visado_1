const request = require('request-promise');
const album = require('./album');
const modelExep = require('./ModelException');

class Requester{

    constructor(){
        this.urlNotifications = "http://172.20.0.21:5000/api/"
        this.urlSpotifyV1 = "https://api.spotify.com/v1/"
        this.urlMusixMatch = "http://api.musixmatch.com/ws/1.1/"
        this.token = 'BQB9gE3bfIBUq8BbZ8XRreaXEFLFUhk3TVdOgfHRmGTFDELU0luUU3_NuUwvUneb5BtjssEhNfFLCKrxuyZr-OVfk8gPGjLao39VHb_0-aow7iud3zPbB0y5Rw0O2wlaBPJ0MmD-bpwaNrzNdtz3Nfb7IdyjDIcVdZ5FEpqoQCeh0MRFHF2SwA'
        this.apiKey = '6c6e31a005105f654a01249c588c2d26'
    }

    requestNuevoAlbum( notificacion ){
        let options = {
            url: this.urlNotifications + 'notify/',
            json: true,
            body: notificacion
        }

        request.post(options).catch( (error) => console.log(error) )
    }

    requestBorrarSubscripcion( artistaId ){
        let options = {
            url: this.urlNotifications + 'subscriptions/',
            json: true,
            body: {artistaId: artistaId}
        }

        request.delete(options).catch( (error) => console.log(error) )
    }

    requestAlbumsByArtistId( aArtist, id ){
        let options = {
            url: this.urlSpotifyV1+'artists/'+id+'/albums',
            headers: { Authorization: 'Bearer ' + this.token },
            json: true,
        }

        request.get(options).then((response)=>{
            if (response.items.length != 0){
                aArtist.albums = response.items.map( aAlbum => new album.Album(aAlbum.name, aAlbum.release_date ));
            }else{
                throw new modelExep.NotFoundException('No se encontraron albums')
            }    
        });
    }

    requestAlbumsByArtistName( aArtist ){
        
        let options = {
            url: this.urlSpotifyV1+'search',
            headers: { Authorization: 'Bearer ' + this.token },
            json: true,
            qs: {
                limit: 10,
                type: 'artist',
                q: aArtist.name
              }
        }

        request.get(options)
                .then((response)=>{
                    return response.artists.items[0].id;
                    })
                .then((respuesta)=>{this.requestAlbumsByArtistId ( aArtist, respuesta )});
    }

    requestLyricsByTrackId( aTrack, id ){
        let options = {
            url: this.urlMusixMatch+'track.lyrics.get?track_id=' + id +'&apikey=' + this.apiKey,
            json: true,
        }

        request.get(options).then((response)=>{
            aTrack.lyrics = response.message.body.lyrics.lyrics_body;
            console.log(response.message.body.lyrics.lyrics_body);
        });
    }

    requestLyricsByTrackName( aTrack ){
        
        let options = {
            url: this.urlMusixMatch+'track.search?q_track=' + aTrack.name +'&apikey=' + this.apiKey,
            json: true,
        }

        return request.get(options)
                .then((response)=>{
                    return response.message.body.track_list[0].track.track_id; 
                    })
                .then((respuesta)=>{this.requestLyricsByTrackId(aTrack, respuesta)});
    }

}

module.exports = {
    Requester,
  };

