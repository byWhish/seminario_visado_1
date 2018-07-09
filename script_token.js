const {google} = require ('googleapis') 

//seteo el cliente
var oauth2Client = new google.auth.OAuth2(
    '393126069402-fa8bfkusfcojkj8lvjd29t739abq0n33.apps.googleusercontent.com',
    'DlhMIoYdXNh2D7fQzDG5m_-Q',
    'urn:ietf:wg:oauth:2.0:oob'
)

//este es el codigo obtenido de script_url
const code = '4/AADM21cdF_wrVkUEpxiIZBYWO6gDHjsSJFSmNTP9Eg0luGHRQBezHJo'

//esto me devuelve el token
async function authenticate( code ){
        const {tokens} = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens);
        console.log(tokens)
}

authenticate(code)