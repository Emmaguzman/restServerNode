//VARIABLES GLOBALES HEROKU=> heroku.config:set||get x=""
//EJ:heroku config:set SEMILLA='secretoProduccion'

//====================
//=====Puerto=========
//====================

process.env.PORT = process.env.PORT || 3000;


//====================
//=====Entorno========
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
//========BD==========
//====================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = "mongodb://localhost:27017/cafe"
} else {
    urlBD = process.env.MONGO_URI;
}
process.env.URLDB = urlBD;


//====================
//==EXPIRACION TOKEN==
//====================
//segundos 60
//minutos 60
//horas 24
//dias 30
process.env.CADUCIDAD_TOKEN = '48h'


//=====================
//=SEED AUTENTICATION=
//=====================

process.env.SEMILLA = process.env.SEMILLA || 'secreto';

//=====================
//=GOOGLE CLIENT ID=
//=====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '448078851013-2sdvittc29l1gimfd12lr5u0eptm4vdp.apps.googleusercontent.com';