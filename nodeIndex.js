const { begin } = require('json-6'),
    { request } = require('https');

module.exports = () => {
    return new Promise(($, _) => {
        request('https://nodejs.org/download/release/index.json', res => {
            console.log(res);
            res.pipe(begin($));
        }).on('err', _)
    })
}
