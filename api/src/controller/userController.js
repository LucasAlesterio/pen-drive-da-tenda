const User = require('../models/users');
const {createToken, verifyToken,decodeBase64Image,deleteFile,uploadImage,deleteImage,deleteOldImage} = require('../functions');
const Link = require('../models/links');
const { v4: uuidv4 } = require('uuid');

module.exports = {

    async addUser(request,response){
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
                await decodeBase64Image(photograph,user);
                const url = await uploadImage(user);
                if(url){
                    deleteFile(user);
                }
                else{
                    err.error = true;
                    err.photo = true;
                }
                photograph = `https://storage.googleapis.com/twm-images/${user}.png`;
            }
            _user = await User.create({name,email,password,user,photograph});
            var token = createToken(_user.id);
            return response.json({token:token});
        }else{
            return response.json(err);
        }
    },

    async login(request,response){
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
    },

    async dataUser(request,response){
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
            /*
            var _favorites = await Link.find().select(['name','photograph','average']).where('_id').in(favorites).exec();
            var _links = await Link.find().select(['name','photograph','average']).where('_id').in(links).exec();
            */
            return response.json({id,name,email,user,photograph,friends,me:true});
    }else{
        //var _links = await Link.find().select(['name','photograph','average']).where('_id').in(links).exec();
        var flag = false;
        const _userLink = await User.findOne({user:idUser});
        if(myProfile.friends.indexOf(_userLink._id) !== -1){
            flag = true;
        }else{
            flag = false;
        }
        return response.json({id,name,email,user,photograph,friends,me:false,isFriend:flag});
    }
    },
    async listMyLinks(request,response){
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
    },

    async listMyFavorites(request,response){
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
    },

    async updateFriend(request,response){
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
    },
    async updatePassword(request,response){
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
    },
    async updateProfile(request,response){
        let err = {"error":false,"user":false,"photo":false};
        var data = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const myData = await User.findOne({_id:_id});
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
            idGerado = uuidv4();
            
            if(myData.photograph === `https://storage.googleapis.com/twm-images/${data.user}.png`){
                deleteImage(data.user);
            }else{
                if(myData.photograph){
                    deleteImage(myData.idImg);
                }
            }
            
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
        }}
        await User.findOneAndUpdate({_id:_id},data, {upsert: true}, function(err, doc) {
            if (err) return response.json({error:true,message:err});
        });
        return response.status(200).send('Ok!');
    
    },

    async listFriends(request,response){
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
    },
    
    async findUser(request,response){
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
    },
    async refreshToken(request,response){
        const {authorization} = request.headers;
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const token = createToken(id);
        const _user = await User.findOne({_id:id});
        return response.json({user:_user.user,photograph:_user.photograph,id:_user._id,token});
    },
    async deleteUser(request,response){
        const {authorization} = request.headers;
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        if(_user.photograph === `https://storage.googleapis.com/twm-images/${_user.user}.png`){
            deleteImage(_user.user);
        }else{
            if(_user.photograph){
                deleteImage(_user.idImg);
            }
        }
        await User.findByIdAndDelete({_id:id});
        return response.status(200).send('Ok!')
    }
}
