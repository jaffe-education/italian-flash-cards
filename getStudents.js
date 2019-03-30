const {getGSheetData} = require('./helpers/getGSheetData')
const cors = require('cors');
const sha1 = require('sha1');
const R = require('ramda');

/**
 * Gets the library of questions via a POST request.
 * Variables passed: {spreadsheetId: G-Sheet ID, class: Sheet name}
 * Returns an object to the client:
 * {
    "error": false,
    "data": [
        {
            "lastName": "Jaffe",
            "firstName": "Roger",
            "class": "APCSA",
            "period": "2",
            "password": "asdfdsa"  // sha1 hashed
        },
        {...}
    ]
   }
 * @type {string[]}
 */

const fields = ['lastName','firstName','class','period','password']

exports.getStudents = (req, res) => {
  let corsFn = cors()
  corsFn(req, res, function() {
    getGSheetData(req.body.spreadsheetId)
      .then(result => {
        let data = result.data.values
        // Remove the field names row
        data = R.tail(data)
        // Convert to key/value object with field names as keys
        data = R.map(row => R.zipObj(fields, row), data)
        // Hash the passwords
        data = R.map(row => {
          if (row.password) {
            row.password = sha1(row.password)
          }
          return row;
        }, data)
        res.status(200).send({error: false, data})
      })
      .catch(err => {
        res.status(404).send({error: true, err})
      })
  })
}

