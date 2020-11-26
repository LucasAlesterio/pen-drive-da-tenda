const User = require('../models/users');
const {createToken, verifyToken,decodeBase64Image,deleteFile,uploadImage,deleteImage,deleteOldImage} = require('../functions');
const Link = require('../models/links');
const { v4: uuidv4 } = require('uuid');
var fs = require("fs");

module.exports = {
    async default(request,response){
        return response.send('Ola');
    },
    async addUser(request,response){
        try{
            var {name,email,password,user,photograph} = request.body;
            let err = {"error":false,"email":false,"user":false,"photo":false};
        let _user = await User.findOne({user});
        let _email = await User.findOne({email});
        if(_user){
            err.error = true;
            err.user = true;
        }
        if(_email){
            err.error = true;
            err.email = true;
        }
        if(!_user && !_email){
            if(photograph){
                const url = await uploadImage(user,photograph);
                    
                if(!url){
                    err.error = true;
                    err.photo = true;
                    return response.json(err);
                }
                photograph = `https://storage.googleapis.com/twm-images/${user}`;
            }
            _user = await User.create({name,email,password,user,photograph});
            var token = createToken(_user.id);
            return response.json({token:token});
        }else{
            return response.json(err);
        }
        }catch(error){
            console.log(error);
            return response.status(500).send('Server error');
        }
    },
    
    async login(request,response){
        try{
            var {user,email,password} = request.body;
            let err = {"error":false,"email":false,"password":false};
            let _user = {};
            if(user){
                _user = await User.findOne({user});
                if(_user){
                if(_user.password === password){
                    var token = createToken(_user.id);
                    return response.json({token});
                }else{
                    err.error = true;
                    err.password = true;
                }
            }else{
                err.error = true;
                err.user = true;
            }
        }if(email){
            _user = await  User.findOne({email});
            if(_user){
                if(_user.password === password){
                    var token = createToken(_user.id);
                    return response.json({token});
                }else{
                    err.error = true;
                    err.password = true;
                }
            }
        }if(!user){
            err.error = true;
            err.email = true;
        }
        return response.json(err);
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },

    async dataUser(request,response){
        try{
            const {authorization} = request.headers;
            const {idUser} = request.body;
            let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var _user = '';
        _user = await User.findOne({user:idUser});
        if(!_user){
            return response.json({error:true,empty:true});
        }
        const {id,name,email,user,photograph,friends,favorites,links} = _user;
        const myProfile = await User.findOne({_id:_id});
        if(idUser == myProfile.user){

            return response.json({id,name,email,user,photograph,friends,me:true});
    }else{
        var flag = false;
        const _userLink = await User.findOne({user:idUser});
        if(myProfile.friends.indexOf(_userLink._id) !== -1){
            flag = true;
        }else{
            flag = false;
        }
        return response.json({id,name,email,user,photograph,friends,me:false,isFriend:flag});
    }
}catch(error){
    console.log(error);
    return response.status(500).send('Server error');
}
},
async listMyLinks(request,response){
    try{
        let count = 0;
        const {authorization} = request.headers;
        const {idUser,page,pageSize} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        _user = await User.findOne({user:idUser});
        if(!_user){
            return response.json({error:true,empty:true});
        }
        const {links} = _user;
        count = links.length;
        var _links = await Link.find().select(['name','photograph','average']).where('_id').in(links).skip(page*pageSize).limit(pageSize).sort('name').exec();
        return response.json({links:_links,count:count});
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },

    async listMyFavorites(request,response){
        try{
            let count = 0;
            const {authorization} = request.headers;
        const {page,pageSize} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        _user = await User.findOne({_id:_id});
        if(!_user){
            return response.json({error:true,empty:true});
        }
        //console.log(_user);
        const {favorites} = _user;
        var _favorites = await Link.find().select(['name','photograph','average']).where('_id').in(favorites).skip(page*pageSize).limit(pageSize).exec();
        count = favorites.length;
        //console.log(count);
        return response.json({links:_favorites,count:count});
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },

    async updateFriend(request,response){
        try{
            const {authorization} = request.headers;
            const {friend} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        if(_user.friends.indexOf(friend) !== -1){
            _user.friends.map((f,index)=>{
                if(f === friend){
                    _user.friends.splice(index,1);
                }
            })
        }else{
            if(friend == _id){
                return response.json({error:true,me:true});
            }
            _user.friends.push(friend);
        }
        await _user.save();
        return response.status(200).send('Ok!');
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    async updatePassword(request,response){
        try{
            const {oldPassword,newPassword} = request.body;
            const {authorization} = request.headers;
            let _id = verifyToken(authorization);
            if(!_id){
                return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        if(_user.password === oldPassword){
            _user.password = newPassword;
            await _user.save();
            return response.status(200).send('Ok!');
        }else{
            return response.json({error:true,password:true});
        }
        }catch(error){
            console.log(error);
            return response.status(500).send('Server error');
        }
    },

    async updateProfile(request,response){
        try{
            let err = {"error":false,"user":false,"photo":false};
            var data = request.body;
            const {authorization} = request.headers;
            let _id = verifyToken(authorization);
            if(!_id){
                return response.json({error:true,token:true});
            }
            const myData = await User.findOne({_id:_id});
            console.log(myData)
            if(data.user){
                if(data.user != myData.user){
                    const testeUser = await User.findOne({user:data.user});
                    if(testeUser){
                        err.error = true;
                        err.user = true;
                    return response.json(err);
                    }
                }
            }
            if(data.photograph){
                
                if(data.photograph != myData.photograph){
                    console.log('Tem foto')
                    var idGerado = uuidv4();
                
                    if(myData.photograph == `https://storage.googleapis.com/twm-images/${myData.user}`){
                        
                    await deleteImage(myData.user);
                    }else{console.log('Tem foto')
                        if(myData.photograph){
                            deleteImage(myData.idImg);
                        }
                    }
                
                const url = await uploadImage(String(idGerado),data.photograph);
                if(!url){
                    err.error = true;
                    err.photo = true;
                }
                data.photograph = `https://storage.googleapis.com/twm-images/${idGerado}`;
                data.idImg = idGerado;
            }}
        await User.findOneAndUpdate({_id:_id},data, {upsert: true}, function(err, doc) {
            if (err) return response.json({error:true,message:err});
        });
        return response.status(200).send('Ok!');
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
        
    },
    
    async listFriends(request,response){
        try{
            let count = 0;
            const {authorization} = request.headers;
        const {page,pageSize} = request.body;
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        const list = await User.find().select(['user','name','photograph']).where('_id').in(_user.friends).skip(page*pageSize).limit(pageSize).exec();
        const a = JSON.stringify(list);
        var b = JSON.parse(a);
        count = _user.friends.length;
        b.map((b)=>{
            return(b['isFriend'] = true)
        });
        return response.json({friends:b,count:count});
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    
    async findUser(request,response){
        try{
            let count = 0;
            const {authorization} = request.headers;
            const {search,page,pageSize} = request.body;
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        if(search){
            let query = [
                {
                    '$search': {
                        'search': {
                            'path': [
                            'name', 'user'
                        ], 
                        'query': search
                    }
                    }
                }, {
                    '$project': { 
                        'photograph': 1, 
                        '_id': 1, 
                        'user': 1,
                        'friends':1
                    }
                }
            ];
            count =  await User.aggregate(query).count("userCount");
            let list = await User.aggregate(query).skip(page*pageSize).limit(pageSize);
            const a = JSON.stringify(list);
            var b = JSON.parse(a);
            b.map((friend,index)=>{
                if(_user.friends.indexOf(friend._id) !== -1){
                    b[index]['isFriend'] = true;
                }else{
                    b[index]['isFriend'] = false;
                }
            });
            if(list.length>0){
                return response.json({friends:b,count:count[0].userCount});
            }
            return response.json({friends:b,count:0});
        }
        const list = await User.find().select(['user','name','photograph']).where('_id').in(_user.friends).skip(page*pageSize).limit(pageSize).exec();
        const a = JSON.stringify(list);
        var b = JSON.parse(a);
        count = _user.friends.length;
        b.map((b)=>{
            return(b['isFriend'] = true)
        });
        return response.json({friends:b,count:count});
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    },
    async refreshToken(request,response){
        try{
            const {authorization} = request.headers;
            let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const token = createToken(id);
        const _user = await User.findOne({_id:id});
        return response.json({user:_user.user,photograph:_user.photograph,id:_user._id,token});
        }catch(error){
            console.log(error);
            return response.status(500).send('Server error');
        }
    },
    async deleteUser(request,response){
        try{
            const {authorization} = request.headers;
            let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        if(_user.photograph === `https://storage.googleapis.com/twm-images/${_user.user}`){
            deleteImage(_user.user);
        }else{
            if(_user.photograph){
                deleteImage(_user.idImg);
            }
        }
        await User.findByIdAndDelete({_id:id});
        return response.status(200).send('Ok!')
    }catch(error){
        console.log(error);
        return response.status(500).send('Server error');
    }
    }
}
