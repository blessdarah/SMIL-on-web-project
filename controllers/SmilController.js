const path = require('path');
const fs = require('fs');
const SmilModel = require('../models/SmilModel');
const {
    v4: uuid
} = require('uuid');
const WebSocket = require('ws');
const { request } = require('http');
const socketServer = new WebSocket("ws://localhost:7000");

exports.index = (req, res) => {
    SmilModel.findAll()
        .then(smil => res.render('index', {
            data: smil.map(item => item.dataValues)
        }))
        .catch(error => res.status(500).send({
            message: "an error occured, could not load data from server: " + error
        }));
};

exports.home = (req, res) => {
    res.render('home');
};

exports.create = (req, res) => {
    const file = req.session.file;
    const {
        contentType,
        textContent,
        fileName,
        imageUrl,
        videoUrl,
        leftPosition,
        topPosition,
        duration,
        delay
    } = req.body;

    let smilContent, content;
    switch (contentType) {
        case 'text':
            // creat a file with `fileName` in the publick dir
            const filePath = path.join(__dirname, '../public/', `${fileName}.txt`);
            fs.writeFile(filePath, textContent, (error) => console.log('And error occured: ', error));
            smilContent = `<text src="./public/${fileName}.txt" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Text" />`;
            content = textContent;
            break;
        case 'image':
            smilContent = `<img src="${imageUrl}" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Image" />`;
            content = imageUrl;
            break;
        case 'video':
            smilContent = `<video src="${videoUrl}" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Image" />`;
            content = videoUrl;
            break;
        case 'imageFile':
            // handle image upload and return image file path
            const {
                imageFileSrc
            } = req.files;
            const file = imageFileSrc[0];
            smilContent = `<img src="public/images/${file.filename}" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Image" />`;
            content = "public/images/${file.filename}";
            break;
        case 'videoFile':
            const {
                videoFileSrc
            } = req.files;
            const video = videoFileSrc[0];
            smilContent = `<video src="public/images/${video.filename}" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Image" />`;
            content = "public/images/${video.filename}";
            break;
    }

    // save content to database
    SmilModel.create({
            smil_id: uuid(),
            file,
            contentType,
            content,
            smilContent,
            duration,
            delay,
            leftPosition,
            rightPosition: topPosition
        }).then(response => response)
        .catch(error => console.error('Could not create smil data: ', error));

    res.redirect(`/messages/${file}/details`);
};

exports.update = (req, res) => {
    const file = req.session.file;
    console.log("Update smil message content: ", req.body);
    const {
        contentType,
        textContent,
        fileName,
        imageUrl,
        videoUrl,
        leftPosition,
        topPosition,
        duration,
        delay
    } = req.body;

    let smilContent, content;
    switch (contentType) {
        case 'text':
            // creat a file with `fileName` in the publick dir
            const filePath = path.join(__dirname, '../public/', `${fileName}.txt`);
            fs.writeFile(filePath, textContent, (error) => console.log('And error occured: ', error));
            smilContent = `<text src="./public/${fileName}.txt" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Text" />`;
            content = textContent;
            break;
        case 'image':
            smilContent = `<img src="${imageUrl}" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Image" />`;
            content = imageUrl;
            break;
        case 'video':
            smilContent = `<video src="${videoUrl}" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Image" />`;
            content = videoUrl;
            break;
        case 'imageFile':
            // handle image upload and return image file path
            const {
                imageFileSrc
            } = req.files;
            const file = imageFileSrc[0];
            smilContent = `<img src="public/images/${file.filename}" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Image" />`;
            content = "public/images/${file.filename}";
            break;
        case 'videoFile':
            const {
                videoFileSrc
            } = req.files;
            const video = videoFileSrc[0];
            smilContent = `<video src="public/images/${video.filename}" begin="${delay || 1}s" top="${topPosition}" left="${leftPosition}" region="Image" />`;
            content = "public/images/${video.filename}";
            break;
    }

    // save content to database
    SmilModel.update({
            file: file,
            contentType: contentType,
            content: content,
            smilContent: smilContent,
            duration: duration,
            delay: delay,
            leftPosition: leftPosition,
            rightPosition: topPosition
        }, {
            where: { smil_id: req.params.id }
        }).then(response => console.log("new data updated successfully", response))
        .catch(error => console.error('Could not create smil data: ', error));

    res.redirect(`/messages/${file}/details`);
};

exports.edit = (req, res) => {
    SmilModel.findAll({
            where: {
                smil_id: req.params.id
            }
        }).then(result => {
            const message = result.map(item => item.dataValues);
            return res.status(200).json(message);
        })
        .catch(error => console.log("error editing message: ", error));
};


exports.delete = (req, res) => {
    SmilModel.destroy({
            where: {
                smil_id: req.params.id
            }
        }).then(feedback => res.status(201).redirect(`/messages/${req.session.file}/details`))
        .catch(error => console.log('deleting smil message error: ', error));
};

exports.generate = async(req, res) => {
    SmilModel.findAll()
        .then(smil => {
            smil = smil.map(item => item.dataValues);
            addSmilContent(smil);
            socketServer.send("New message has been sent, click to play");
            req.session.message = "Smil content has been generated";
        })
        .catch(err => console.log('fetch error ', err));

    res.redirect(`messages/${req.session.file}/details`);
};

const getSmilContentHeader = () => {
    return `<smil>
  <head>
    <layout>
      <region id="Image" height="100%" width="100%" fit="meet"/>
      <region id="Text" height="100%" width="100%" fit="scroll"/>
    </layout>
  </head>
  <body>`;
};

const getSmilContentFooter = () => {
    return `</body>
</smil>`;
};

function addSmilContent(smilDataList) {
    let listContent = '';
    smilDataList.map(smilData => {
        listContent += `<par dur= "${smilData.duration || 1}s">
            ${smilData.smilContent}
        </par>
        `;
    });

    const smilContent = `
    ${getSmilContentHeader()}
        ${listContent}
    ${getSmilContentFooter()}`;

    // write content to smile file
    fs.writeFile(path.join(__dirname, '../test.smil'), smilContent, (error) => error ? console.log('writing to file error: ', error) : '');
    fs.writeFile(path.join(__dirname, '../preview.txt'), smilContent, (error) => error ? console.log('writing to file error: ', error) : '');
}