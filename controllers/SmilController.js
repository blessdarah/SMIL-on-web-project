const path = require('path');
const fs = require('fs');
const SmilModel = require('../models/SmilModel');
const {
    v4: uuid
} = require('uuid');

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

    let content;
    switch (contentType) {
        case 'text':
            // creat a file with `fileName` in the publick dir
            const filePath = path.join(__dirname, '/public/', `${fileName}.txt`);
            fs.writeFile(filePath, textContent, (error) => console.log('And error occured: ', error));
            content = `<text src = "./public/${fileName}.txt" begin="${delay || 1}s" region = "Text" />`;
            break;
        case 'image':
            content = `<img src="${imageUrl}" begin="${delay || 1}s" region = "Text" />`;
            break;
        case 'video':
            content = `<video src="${videoUrl}" begin="${delay || 1}s" region = "Text" />`;
            break;
        case 'imageFile':
            // handle image upload and return image file path
            break;
        case 'videoFile':
            // handle image upload and return image file path
            break;
    }

    // save content to database
    SmilModel.create({
            smil_id: uuid(),
            contentType,
            content,
            duration,
            delay,
            leftPosition,
            topPosition
        }).then(response => response)
        .catch(error => console.error('Could not create smil data: ', error));

    res.redirect('/');
};

exports.generate = async(req, res) => {
    SmilModel.findAll()
        .then(smil => {
            smil = smil.map(item => item.dataValues);
            addSmilContent(smil);
        })
        .catch(err => console.log('fetch error ', err));

    res.redirect('/');
};


const getSmilContentHeader = () => {
    return `<smil>
  <head>
    <layout>
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
            ${smilData.content}
        </par>
        `;
    });

    const smilContent = `
    ${getSmilContentHeader()}
        ${listContent}
    ${getSmilContentFooter()}
    `;

    // write content to smile file
    fs.writeFile(path.join(__dirname, '../test.smil'), smilContent, (error) => error ? console.log('writing to file error: ', error) : '');

    // run command to open file with smil player
}