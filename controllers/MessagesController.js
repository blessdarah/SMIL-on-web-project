const Message = require('../models/MessageModel');
const SmilModel = require('../models/SmilModel');
const fs = require('fs');
const path = require('path');

exports.index = (req, res) => {
    Message.findAll().
    then(messages => res.render('messages/index', {
            messages: messages.map(item => item.dataValues)
        }))
        .catch(error => {
            if (error) console.log(error);
        });
};

exports.create = (req, res) => res.render('messages/create');
exports.store = (req, res) => {
    Message.create()
        .then(message => {
            res.status(200).redirect('/messages');
        })
        .catch(error => console.log('create message error: ', error));
};

exports.delete = async(req, res) => {
    try {
        await Message.destroy({
            where: {
                id: req.params.id
            }
        });

        // get all smil content matching the current file
        const smilData = await SmilModel.findAll({
            where: {
                file: req.params.id
            }
        });
        if (smilData.length > 0) {
            await SmilModel.destroy({
                where: {
                    file: req.session.file || req.params.id
                }
            });
        }

    } catch (error) {
        console.log('delete error: ', error);
    }
};

exports.details = (req, res) => {
    req.session.file = req.params.id;
    SmilModel.findAll({
            where: {
                file: req.params.id
            }
        }).then(result => {
            res.render('messages/details', {
                data: result.map(item => item.dataValues)
            });
        })
        .catch(error => console.log('message detail error: ', error));
};

exports.show = (req, res) => {
    req.session.file = req.params.id;
    SmilModel.findAll({
            where: {
                smil_id: req.params.id
            }
        }).then(result => {
            console.log('message result: ', result);
            res.render('messages/show', {
                data: result.map(item => item.dataValues)
            });
        })
        .catch(error => console.log('message detail error: ', error));
};

exports.preview = (req, res) => {
    // read data in preview file
    const filePath = path.join(__dirname, '../preview.txt');
    console.log('file path name: ', filePath);

    fs.readFile(filePath, (err, result) => {
        if (err) {
            console.log('could not read file', err);
        } else {
            res.status(201).render('messages/preview', {
                data: result.toString()
            });
        }
    });
};