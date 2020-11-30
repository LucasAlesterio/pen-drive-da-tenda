const User = require('../models/users');
const Link = require('../models/links');
const {verifyToken, uploadImage, deleteImage, resizeFromURL} = require('../functions');
const { v4: uuidv4 } = require('uuid');
const mongoose  = require('mongoose');


module.exports = {
    async resizeImageFromURL(request,response){
        try{
            //const {link} = request.body;
            const links = await Link.find();
            if(links){
                //return response.send(await deleteImage(`mini${links[0].idImg}`));
                async function teste(link,index){
                    if(!link.mini){
                        console.log('links atualizados: ',index);
                        const urlResized = await resizeFromURL(200,link.photograph,`mini${link.idImg}.png`);
                        console.log(urlResized);
                        if(urlResized){
                            //link.mini = `https://storage.googleapis.com/twm-images/mini${link.idImg}.png`;
                            await Link.findOneAndUpdate({_id:link._id},
                                {mini:`https://storage.googleapis.com/twm-images/mini${link.idImg}.png`}, 
                                {upsert: true}, 
                                function(err, doc) {
                                    if (err) return response.json({error:true,message:err});
                                });
                            }
                        }
                }
                
                links.map((link,index)=>{
                        teste(link,index);
                    });
                return response.send('Links atualizados!');
                    
            }
        }catch(error){
            console.log(error);
        }
    },
    async addLink(request,response){
        try{
            var {name,link,description,photograph,type,tag} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var idGerado = null;
        var _user = await User.findOne({_id:_id});
        var resized = '';
        var urlMini = '';
        if(photograph){
            idGerado = uuidv4();
            /*
            let flag = await decodeBase64Image(photograph,idGerado);
            if(flag){
                return response.json({error:true,image:true});
            }
            */
            const url = await uploadImage(idGerado,photograph);
            if(!url){
                err.error = true;
                err.photo = true;
            }
            photograph = `https://storage.googleapis.com/twm-images/${idGerado}`;
            resized = await resizeFromURL(200,photograph,`mini${idGerado}.png`);
            if(resized){
                urlMini = `https://storage.googleapis.com/twm-images/mini${idGerado}.png`;
            }
        }
        var _link = await Link.create({name,link,description,photograph,type,tag,user:_user.id,idImg:idGerado,mini:urlMini});
        _user.links.push(_link._id);
        _user.save();
        return response.json({id:_link._id});
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    
    async deleteLink(request,response){        
        try{
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
                    await deleteImage(`mini${_link.idImg}.png`)
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
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    
    async dataLink(request,response){
        try{

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
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    
    async updateLink(request,response){
        try{
            var data = request.body;
            const {authorization} = request.headers;
            let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var idGerado = null;
        var resized = '';
        var _link = await Link.findOne({_id:data.id});
        if(data.photograph && data.photograph != _link.photograph){
            if(_link.photograph){
                await deleteImage(_link.idImg);
                await deleteImage(`mini${_link.idImg}.png`)
            }
            idGerado = uuidv4();
            const url = await uploadImage(String(idGerado),data.photograph);
            if(!url){
                err.error = true;
                err.photo = true;
            }
            data.photograph = `https://storage.googleapis.com/twm-images/${idGerado}`;
            resized = await resizeFromURL(200,data.photograph,`mini${idGerado}.png`);
            if(resized){
                data.mini = `https://storage.googleapis.com/twm-images/mini${idGerado}.png`;
            }
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
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    
    async updateFavorite(request,response){
        try{
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
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    
    async rating(request,response){
        try{
            const {authorization} = request.headers;
            const {link,stars} = request.body;
        var flag = false;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        //await User.findOne({_id:_id});
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
        return response.json({average:average});
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    
    async searchLink(request,response){
        try{
            const {authorization} = request.headers;
            const {text,page,pageSize,type,order} = request.body;
            let _id = verifyToken(authorization);
            if(!_id){
                return response.json({error:true,token:true});
            }
            let count = 0;
            let sor = {};
            if(order){
                if(order == 1){
                    sor['name']=1;
                }
                if(order == 2){
                sor['name']=-1;
            }
            if(order == 3){
                sor['_id']=-1;
            }
            if(order == 4){
                sor['_id']=1;
            }
            if(order == 5){
                sor['average']=-1;
                sor['name']=1;
            }
            if(order == 6){
                sor['average']=1;
                sor['name']=1;
            }
        }else{
            sor['_id']=-1;
        }
        if(text){
            let query = [];
            if(type){
                query = [
                    {
                        '$search': {
                            'search': {
                                'path': [
                                    'name', 'description', 'tag.name'
                            ], 
                            'query': text
                            }
                            ,"highlight": { 
                                "path": "name"
                            }
                        }
                    },{
                        '$sort': sor
                    },
                    {
                        '$match':{
                            'type.name': type
                        }   
                    },
                        {
                            '$project': {
                            'name': 1, 
                            'mini': 1, 
                            '_id': 1, 
                            'average': 1
                        }
                    }
                ];
            }else{
                query = [
                    {
                        '$search': {
                            'search': {
                                'path': [
                                'name', 'description', 'tag.name'
                            ], 
                            'query': text
                            }
                            ,"highlight": { 
                                "path": "name"
                            }
                        }
                        },
                        {
                        '$project': {
                            'name': 1, 
                            'mini': 1, 
                            '_id': 1, 
                            'average': 1
                        }
                    },{
                        '$sort': sor
                        }
                    ];
                    
            }
            count =  await Link.aggregate(query).count("userCount");
            const resp = await Link.aggregate(query).skip(page*pageSize).limit(pageSize);
            //
            if(resp.length>0){
                return response.json({links:resp,count:count[0].userCount});
            }
            return response.json({links:resp,count:0});
        }else{
            if(type){
                var links = await Link.find().select(['name','mini','average'])
                .skip(page*pageSize).limit(pageSize).where('type.name')
                .equals(type).sort(sor).exec();
                
                count = await Link.find().select(['name','mini','average'])
                .where('type.name').equals(type).
                countDocuments();
                return response.json({links,count:count});
            }
            var links = await Link.find().select(['name','mini','average'])
            .skip(page*pageSize).limit(pageSize).sort(sor).exec();
            count = await Link.countDocuments();
            return response.json({links,count:count});
        }
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    async searchInMyLinks(request,response){
        try{
            const {authorization} = request.headers;
            const {text,page,pageSize,myLinks,user} = request.body;
            let _id = verifyToken(authorization);
            if(!_id){
                return response.json({error:true,token:true});
            }
            const _user = await User.findOne({user:user});
            let ids = [];
            if(myLinks){
                ids = _user.links.map(function(el) { return mongoose.Types.ObjectId(el) })
            }else{
                ids = _user.favorites.map(function(el) { return mongoose.Types.ObjectId(el) })
            }
            let count = 0;
            let query = [
                {
                    '$search': {
                        'search': {
                            'path': [
                                'name', 'description', 'tag.name'
                            ], 
                            'query': text
                        },
                        "highlight": { 
                            "path": "name"
                        }
                    }
                    
            },{'$match':{
                '_id':{
                    '$in':ids
                }
            }},{
                '$sort': {'name':1}
            },
                {
                    '$project': {
                        'name': 1, 
                        '_id':1,
                        'mini': 1,
                        'average': 1,
                }
            }
            ];
        count =  await Link.aggregate(query).count("userCount");
        //console.log(_user.links)
            const resp = await Link.aggregate(query).skip(page*pageSize).limit(pageSize);
            if(resp.length>0){
                return response.json({links:resp,count:count[0].userCount});
            }
            return response.json({links:resp,count:0});

        }catch(error){
            console.log(error);
            return response.status(500).send('Server error');
        }
    },
    async timeline(request,response){
        try{
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
        let lim = count - (pageSize * page);
        if(((count-pageSize)>0) && ((page + 1)*pageSize)<count){
            sk = ((count)-(pageSize*(page + 1)));
            lim = pageSize;
        }
        var links = await Link.find().select(['name','mini','average','user']).where('user').in(_user.friends).skip(sk).limit(lim).exec();
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
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },

    async types(request,response){
        try{
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
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    }
}