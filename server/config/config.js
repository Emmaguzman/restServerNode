//====================
//=====Puerto=========
//====================

process.env.PORT = process.env.PORT || 3000;


//====================
//=====Entorno========
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
//=====BD========
//====================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = "mongodb://localhost:27017/cafe"
} else {
    urlBD = "mongodb+srv://el_emma:jQXKeo275ZWKSU2P@cluster0-mldom.mongodb.net/cafe";
}
process.env.URLDB = urlBD;