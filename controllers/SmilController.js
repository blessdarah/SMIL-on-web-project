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
            smilContent = `<text src = "./public/${fileName}.txt" begin="${delay || 1}s" region = "Text" />`;
            content = textContent;
            break;
        case 'image':
            smilContent = `<img src="${imageUrl}" begin="${delay || 1}s" region="Text" />`;
            content = imageUrl;
            break;
        case 'video':
            smilContent = `<video src="${videoUrl}" begin="${delay || 1}s" region="Text" />`;
            content = videoUrl;
            break;
        case 'imageFile':
            // handle image upload and return image file path
            const {
                imageFileSrc
            } = req.files;
            const file = imageFileSrc[0];
            smilContent = `<img src = "public/images/${file.filename}" begin="${delay || 1}s" region="Text" />`;
            content = "public/images/${file.filename}";
            break;
        case 'videoFile':
            const {
                videoFileSrc
            } = req.files;
            const video = videoFileSrc[0];
            smilContent = `<video src = "public/images/${video.filename}" begin="${delay || 1}s" region="Text" />`;
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
            topPosition
        }).then(response => response)
        .catch(error => console.error('Could not create smil data: ', error));

    res.redirect(`/messages/${file}/details`);
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
            req.session.message = "Smil content has been generated";
        })
        .catch(err => console.log('fetch error ', err));

    res.redirect(`messages/${req.session.file}/details`);
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
            ${smilData.smilContent}
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
    fs.writeFile(path.join(__dirname, '../preview.txt'), smilContent, (error) => error ? console.log('writing to file error: ', error) : '');

    // run command to open file with smil player
}