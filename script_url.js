const {google} = require ('googleapis') 

//seteo el cliente
var oauth2Client = new google.auth.OAuth2(
    '393126069402-fa8bfkusfcojkj8lvjd29t739abq0n33.apps.googleusercontent.com',
    'DlhMIoYdXNh2D7fQzDG5m_-Q',
    'urn:ietf:wg:oauth:2.0:oob'
)

//aca pongo que servicios api voy a usar
const scopes = ['https://www.googleapis.com/auth/blogger']

//esto me genera la url para autorizar y obtener el token
const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes 
})

console.log(url)


