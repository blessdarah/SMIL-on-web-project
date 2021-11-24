const Settings = require("../models/Settings");

exports.index = (req, res) => {
    Settings.findAll().
    then(response => {
        if (response.length === 0) {
            Settings.create({
                    smilPlayerPath: "test path"
                }).then(result => console.log('okay'))
                .catch(err => console.log('could not create settings'));
        }
        res.status(200).render('settings/index', {
            settings: response.map(item => item.dataValues)
        });
    }).catch(error => console.log('No settings records in the db: ', error));
};

exports.update = (req, res) => {
    Settings.update({
            smilPlayerPath: req.body.smilPlayerPath
        }, {
            where: {
                _id: 1
            }
        }).then(result => {
            console.log('edit result: ', result[0]);
            res.status(201).redirect('/settings');
        })
        .catch(error => console.log('could not update file path: ', error));
};