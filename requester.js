const request = require('request-promise');

class Requester{

    constructor(){
        this.urlSpotifyV1 = "https://api.spotify.com/v1/"
        this.urlMusixMatch = "http://api.musixmatch.com/ws/1.1/"
        this.token = 'BQCTOPjO3KIZb8cFGRybJh62d-1y6aKV-u1ZnIGoX01gj2hzz70ZRcj5iIAO4WMtPYsxo569LQ5siMarBIcFzaTFzTYOQfxxq8er-yUIgO12rRTG23fx6Goaiw93dBfmZTywlyiN1sP3lrChW1DzVp5j6c12k0CsKZtJOHdJ31yKqxtpLs6Q3g'
        this.apiKey = '6c6e31a005105f654a01249c588c2d26'
    }

    requestAlbumsByArtistId( aTrack, id ){
        let options = {
            url: this.urlSpotifyV1+'artists/'+id+'/albums',
            headers: { Authorization: 'Bearer ' + this.token },
            json: true,
        }

        request.get(options).then((response)=>{
            aArtist.albums = response.items.map( album => album.name );
            console.log(response.items.map( album => album.name ));
        });
    }

    requestAlbumsByArtistName( aTrack ){
        
        let options = {
            url: this.urlSpotifyV1+'search',
            headers: { Authorization: 'Bearer ' + this.token },
            json: true,
            qs: {
                limit: 10,
                type: 'artist',
                q: aTrack.name
              }
        }

        request.get(options)
                .then((response)=>{
                    return response.artists.items[0].id;
                    })
                .then((respuesta)=>{this.requestAlbumsByArtistId ( id )});
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