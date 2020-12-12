require("dotenv-safe").config();
var fs = require("fs");
const jwt = require('jsonwebtoken');
const gc = require('./cloud');
const bucket = gc.bucket('twm-images');
const resizeImg = require('resize-image-buffer');
var sizeOf = require('buffer-image-size');
//var request = require('request').defaults({ encoding: null });
const axios = require('axios');


module.exports = {
    createToken(id){
        var token = jwt.sign({ id:id }, process.env.SECRET, {
            expiresIn: "10h"
        });
        return token;
    },
    verifyToken(token){
        let id = "";
        jwt.verify(token, process.env.SECRET, function(err, decoded){
            if(err){
                return err;
            }
            id = decoded.id;
        }
    );
    return id;
    },
    /*
    decodeBase64Image(image,name) {
        let base64Image = image.split(';base64,').pop();
            fs.writeFile(`src/temp/${name}.png`, base64Image, {encoding: 'base64'}, function(err) {
                return true;
            });
        return false;
        //var base64Image = new Buffer(original_data, 'binary').toString('base64');
    },
    deleteFile(name){
        try {
            fs.unlinkSync(`src/temp/${name}.png`);
            return true;
        } catch(err) {
            return false;
        }
        
    },
    */
    async uploadImage(name,data){
        function base64MimeType(encoded){
            var result = null;
            if (typeof encoded !== 'string') {
                return result;
            }
            var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
            if (mime && mime.length) {
                result = mime[1];
            }
            return result;
        }
        const fileOptions = {
            public: true,
            resumable: false,
            metadata: { contentType: base64MimeType(data)},
            validation: false
        }
        const base64EncodedString = data.replace(/^data:\w+\/\w+;base64,/, '')
        const fileBuffer = Buffer.from(base64EncodedString, 'base64')
        const url = await bucket.file(name).save(fileBuffer, fileOptions);
        /*
        const res = await gc.bucket('twm-images').upload(`./src/temp/${name}.png`);
        const url = res[0].metadata.mediaLink;
        */
        return url;
    },
    async deleteImage(id){
        await bucket.file(id).delete().then(()=>{
            return true
        });
        return false;
    },
    async resizeFromURL(max,url,name){
        try{
            const response = await axios.get(url,  { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")
        //console.log(buffer);
        var dimensions = sizeOf(buffer);
        var proportion = (dimensions.height/dimensions.width);
        const image = await resizeImg(buffer, {
            width: max,
            height: (max * proportion),
        });
        const cloudUrl = await bucket.file(name).save(image);
        //fs.writeFile(`src/temp/teste.png`, image, {encoding: 'binary'}, function(err) {
            //return true;
        //});
        return cloudUrl;
        }catch(error){
            console.log("error");
        }
    }
        

}