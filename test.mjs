import require from './require.mjs'
import getIndex from './nodeIndex.mjs'
const JSON6 = require('json-6');

getIndex().then(v => {
    console.log(v)
})
