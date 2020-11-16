const User = require('../models/users');
const Link = require('../models/links');
const {verifyToken,decodeBase64Image,deleteFile,uploadImage, deleteImage} = require('../functions');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async addLink(request,response){
        var {name,link,description,photograph,type,tag} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var idGerado = null;
        var _user = await User.findOne({_id:_id});
        if(photograph){
            idGerado = uuidv4();
            await decodeBase64Image(photograph,idGerado);
            const url = await uploadImage(idGerado);
            if(url){
                deleteFile(idGerado);
            }
            else{
                err.error = true;
                err.photo = true;
            }
            photograph = `https://storage.googleapis.com/twm-images/${idGerado}.png`;
        }
        var _link = await Link.create({name,link,description,photograph,type,tag,user:_user.id,idImg:idGerado});
        _user.links.push(_link._id);
        _user.save();
        return response.json({id:_link._id});
    },

    async deleteLink(request,response){
        const {link} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var _user = await User.findOne({_id:_id});
        if(_user.links.indexOf(link) !== -1){
            const _link = await Link.findOne({_id:link});
            if(_link.photograph){
                await deleteImage(_link.idImg);
            }
            await Link.findByIdAndDelete({_id:link});
            _user.links.map((f,index)=>{
                if(f === link){
                    _user.links.splice(index,1);
                }
            })
            _user.save();
            return response.send(true);
        }
        return response.json({error:true,authorization:true});
    },

    async dataLink(request,response){
        const {id} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        let link = [];
        var _user = await User.findOne({_id:_id});
        try{
            link = await Link.findOne({_id:id});
        }catch{
            return response.json({error:true,empty:true});
        }
        const a = JSON.stringify(link);
        var b = JSON.parse(a);
        if(_user.links.indexOf(id) !== -1){
            b['isMy'] = true;
        }else{
            b['isMy'] = false;
        }
        if(_user.favorites.indexOf(id) !== -1){
            b['isFavorite'] = true;
        }else{
            b['isFavorite'] = false;
        }
        const userLink = await User.findOne({_id:link.user});
        return response.json({link:b,user:{id:userLink._id,photograph:userLink.photograph,user:userLink.user}});
    },

    async updateLink(request,response){
        var data = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var idGerado = null;
        var _link = await Link.findOne({_id:data.id});
        if(data.photograph && data.photograph != _link.photograph){
            if(_link.photograph){
                await deleteImage(_link.idImg);
            }
            idGerado = uuidv4();
            await decodeBase64Image(data.photograph,idGerado);
            const url = await uploadImage(idGerado);
            if(url){
                deleteFile(idGerado);
            }
            else{
                err.error = true;
                err.photo = true;
            }
            data.photograph = `https://storage.googleapis.com/twm-images/${idGerado}.png`;
            data.idImg = idGerado;
        }
        var _user = await User.findOne({_id:_id});
        if(_user.links.indexOf(data.id) !== -1){
            await Link.findOneAndUpdate({_id:data.id},data, {upsert: true}, function(err, doc) {
                if (err) return response.json({error:true,message:err});
            });
            return response.status(200).send('Ok!');
        }
        return response.json({error:true,authorization:true});
    },

    async updateFavorite(request,response){
        const {authorization} = request.headers;
        const {link} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        if(_user.favorites.indexOf(link) !== -1){
            _user.favorites.map((f,index)=>{
                if(f === link){
                    _user.favorites.splice(index,1);
                }
            })
        }else{
            _user.favorites.push(link);
        }
        await _user.save();
        return response.status(200).send('Ok!');
    },

    async rating(request,response){
        const {authorization} = request.headers;
        const {link,stars,pageSize,page} = request.body;
        var flag = false;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        await User.findOne({_id:_id});
        let _link = await Link.findOne({_id:link});
        _link.rating.map((rat)=>{
            if(rat.user === _id){
                flag = true;
                rat.nStars = stars;
            }
        });
        if(!flag){
            _link.rating.push({user:_id,nStars:stars});
        }
        average = 0;
        _link.rating.map((score)=>{
            average += score.nStars;
        });
        average = average/_link.rating.length;
        _link.average = average;
        _link.save();
        return response.status(200).send('Ok!');
    },

    async searchLink(request,response){
        const {authorization} = request.headers;
        const {text,page,pageSize} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        let count = 0;
        if(text){
            let query = [
                {
                    '$search': {
                        'search': {
                        'path': [
                            'name', 'description', 'tag.name','type.name'
                        ], 
                        'query': text
                        }
                    }
                    }, {
                    '$project': {
                        'name': 1, 
                        'photograph': 1, 
                        '_id': 1, 
                        'average': 1
                    }
                }
            ];
            count =  await Link.aggregate(query).count("userCount");
            const resp = await Link.aggregate(query).skip(page*pageSize).limit(pageSize);
            //
            if(resp.length>0){
                return response.json({links:resp,count:count[0].userCount});
            }
            return response.json({links:resp,count:0});
        }else{
            //var links = await Link.find().select(['name','photograph','average']).skip(0).limit(20).exec();
            var links = await Link.find().select(['name','photograph','average']).skip(page*pageSize).limit(pageSize).exec();
            count = await Link.countDocuments();
            return response.json({links,count:count});
        }
    },

    async timeline(request,response){
        let count = 0;
        const {authorization} = request.headers;
        const {page,pageSize} = request.body;
        let _id = '';
        _id = await verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        count = await Link.find().select('name').where('user').in(_user.friends).countDocuments();
        //console.log(!((count-pageSize)<0));
        let sk = 0;
        console.log(count);
        if(((count-pageSize)>0) && ((page + 1)*pageSize)<count){
            sk = ((count)-(pageSize*(page + 1)));
        }
        var links = await Link.find().select(['name','photograph','average','user']).where('user').in(_user.friends).skip(sk).limit(pageSize).exec();
        links = JSON.parse(JSON.stringify(links));
        var idusers = links.map((link)=>{
            return link.user;
        });
        var usuario = await User.find().select(['user','photograph','name']).where('_id').in(idusers);
        const resp = links.map((link)=>{
            usuario.map((us)=>{
                if(link.user == us._id){
                    link['user'] = us;
                }
            })
            return(link);
        }).reverse();
        return response.json({link:resp,count:count});
    },

    async types(request,response){
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var links = await Link.find().select('type.name');
        var a = [];
        links.map((link)=>{
            if(a.indexOf(link.type.name) === -1){
                a.push(link.type.name);
            }
        });
        return response.json({types:a});
    }
}