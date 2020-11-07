const {Storage} = require('@google-cloud/storage')

const storage = new Storage({
    keyFilename: './trabalho-final-twm-d832cd772a44.json',
    projectId: 'trabalho-final-twm',
})
module.exports = storage