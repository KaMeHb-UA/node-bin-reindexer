import { Writable } from 'stream'
import require from './require.mjs'

const { begin } = require('json-6'),
    request = require('request');

class JSONPipe extends Writable {
    constructor(resolve){
        super();
        this._jsonpipe = begin(resolve)
    }
    write(chunk){
        return this._jsonpipe.write('' + chunk)
    }
}

export default url => {
    return new Promise(($, _) => {
        const req = request(url);
        const jsonPipe = new JSONPipe($);
        req.on('err', _);
        req.pipe(jsonPipe)
    })
}