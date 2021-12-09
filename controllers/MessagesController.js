const Message = require('../models/MessageModel');
const SmilModel = require('../models/SmilModel');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const {
    exec
} = require("child_process");

const socketServer = new WebSocket('ws://localhost:7000');

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
            socketServer.send("There is a new message,refresh and see.");
            res.status(200).redirect('/messages');
        })
        .catch(error => console.log('create message error: ', error));
};

exports.delete = async(req, res) => {
    console.log('deleting ', req.params.id);
    try {
        // delete all smil content for this file
        await SmilModel.destroy({
            where: {
                file: req.session.file || req.params.id
            }
        });

        await Message.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(201).redirect('/');
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

exports.play = (req, res) => {
    // const invokeExpression = "Invoke-Expression ./test.smil"; // for windows
    // const invokeExpression = "open ./test.smil";
    console.log('calling the play function');
    const invokeExpression = "Powershell.exe -Command Invoke-Expression ./test.smil"; // working
    exec(`${invokeExpression}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    res.redirect('messages/preview');

};