const JSON6 = require('json-6');
require('./nodeIndex')().then(v => {
    console.log(JSON6.stringify(v, null, '    '))
})
