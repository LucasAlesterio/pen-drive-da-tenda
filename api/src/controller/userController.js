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
            //var {id,name,email,user,photograph,friends,favorites,links} = _user;
            return response.json(token);
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
                    //var {id,name,email,user,photograph,friends,favorites,links} = _user;
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
                    //var {id,name,email,user,photograph,friends,favorites,links} = _user;
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
        //let err = {"error":false,"email":false,"password":false};
        const {authorization} = request.headers;
        const {idUser} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var _user = '';
        _user = await User.findOne({user:idUser});
        if(!_user){
            return response.json({error:true,token:true});
        }
        const {id,name,email,user,photograph,friends,favorites,links} = _user;
        var average = 0;
        var a = [];
        var b = {};
        const myProfile = await User.findOne({_id:_id});
        if(idUser == myProfile.user){
            var _favorites = await Link.find().select(['name','photograph','average']).where('_id').in(favorites).exec();
            /*
            _favorites.map((link)=>{
                average = 0;
                b = JSON.parse(JSON.stringify(link));
                if(link.rating){
                    link.rating.map((score)=>{
                        average += score.nStars;
                    });
                }
                average = average/link.rating.length;
                b['average'] = average;
                a.push(b);
            });
            _favorites = a;
            b = {};
            a = [];
        */
        var _links = await Link.find().select(['name','photograph','average']).where('_id').in(links).exec();
        /*
        _links.map((link)=>{
            average = 0;
            b = JSON.parse(JSON.stringify(link));
            if(link.rating){
                link.rating.map((score)=>{
                    average += score.nStars;
                });
            }
            average = average/link.rating.length;
            b['average'] = average;
            a.push(b);
        });
        _links = a;
        */
        return response.json({user:{id,name,email,user,photograph,friends,me:true},favorites:_favorites,links:_links});
    }else{
        var _links = await Link.find().select(['name','photograph','average']).where('_id').in(links).exec();
        /*
        _links.map((link)=>{
            average = 0;
            b = JSON.parse(JSON.stringify(link));
            if(link.rating){
                link.rating.map((score)=>{
                    average += score.nStars;
                });
            }
            average = average/link.rating.length;
            b['average'] = average;
            a.push(b);
        });
        _links = a;
        */
        var flag = false;
        const _userLink = await User.findOne({user:idUser});
        if(myProfile.friends.indexOf(_userLink._id) !== -1){
            flag = true;
        }else{
            flag = false;
        }
        return response.json({user:{id,name,email,user,photograph,friends,me:false,isFriend:flag},links:_links});
    }
    },

    async updateFriend(request,response){
        const {authorization} = request.headers;
        const {friend} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        // if indexOf == -1 no existe
        if(_user.friends.indexOf(friend) !== -1){
            _user.friends.map((f,index)=>{
                if(f === friend){
                    _user.friends.splice(index,1);
                }
            })
           // _user.friends.pop(friend);
        }else{
            _user.friends.push(friend);
        }
        await _user.save();
        //const {id,name,email,user,photograph,friends,favorites,links} = _user;
        //const token = createToken(id);
        //return response.json({id,name,email,user,photograph,friends,favorites,links,token});
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
            //const {id,name,email,user,photograph,friends,favorites,links} = _user;
            //const token = createToken(id);
            //return response.json({id,name,email,user,photograph,friends,favorites,links,token});
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
                deleteImage(myData.idImg);
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
        const _user = await User.findOneAndUpdate({_id:_id},data, {upsert: true}, function(err, doc) {
            if (err) return response.json({error:true,message:err});
        });
        //const {id,name,email,user,photograph,friends,favorites,links} = _user;
        //const token = createToken(id);
        //return response.json({id,name,email,user,photograph,friends,favorites,links,token});
        return response.status(200).send('Ok!');
    
    },

    async listFriends(request,response){
        const {authorization} = request.headers;
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        const list = await User.find().select(['user','name','photograph']).where('_id').in(_user.friends).exec();
        const a = JSON.stringify(list);
        var b = JSON.parse(a);
        // if indexOf == -1 no existe
        b.map((b)=>{
            return(b['isFriend'] = true)
        });
        return response.json(b);
    },
    
    async findUser(request,response){
        const {authorization} = request.headers;
        const {search} = request.body;
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        //var list = await User.find().select(['user','name','photograph']).where('user').in(search).exec();
        let list = await User.aggregate([
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
        ]);

        const a = JSON.stringify(list);
        var b = JSON.parse(a);
        // if indexOf == -1 no existe
        b.map((friend,index)=>{
            if(_user.friends.indexOf(friend._id) !== -1){
                b[index]['isFriend'] = true;
            }else{
                b[index]['isFriend'] = false;
            }
        });
        return response.json(b);
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
    }
}
