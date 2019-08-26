import require from './require.mjs'
import getIndex from './nodeIndex.mjs'
import { readFileSync as read } from 'fs'
const JSON6 = require('json-6'),
    JSON5 = require('json5');

const fileParser = /^(\w+)-(\w+)(-(\w+))?$/;
const byPlatforms = JSON6.parse(read('./node-bin/pkgs.json6', 'utf-8'));
const compressionPriorities = [
    'tar.xz',
    'tar.gz',
    'pkg',
    '7z',
    'zip',
    'msi',
];

function getBestCompression(compressions){
    for(let i = 0; i < compressionPriorities.length; i++){
        if(compressions.indexOf(compressionPriorities[i]) !== -1) return compressionPriorities[i]
    }
    return compressions[0]
}

getIndex().then(idx => {
    idx.forEach(({ version, files }) => {
        if(version.startsWith('v')) version = version.slice(1);
        const [ release, major, minor ] = version.split('.').map(v => +v);
        const store = {};
        files.forEach(file => {
            let [, os, arch, , compression] = fileParser.exec(file) || [];
            if(os === 'osx') os = 'darwin';
            if(os && arch){
                if(!compression) compression = os === 'aix' || release === 0 ? 'tar.gz' : 'tar.xz';
                if(!store[os]) store[os] = {};
                if(!store[os][arch]) store[os][arch] = [];
                store[os][arch].push(compression)
            }
        });
        for(let os in store){
            for(let arch in store[os]){
                const compression = getBestCompression(store[os][arch]);
                if(!byPlatforms[release]) byPlatforms[release] = {};
                if(!byPlatforms[release][major]) byPlatforms[release][major] = {};
                if(!byPlatforms[release][major][minor]) byPlatforms[release][major][minor] = {};
                if(!byPlatforms[release][major][minor][os]) byPlatforms[release][major][minor][os] = {};
                if(!byPlatforms[release][major][minor][os][arch]) byPlatforms[release][major][minor][os][arch] = compression === 'tar.xz' ? 'node' : `node@${compression}`
            }
        }
    });
    console.log(JSON5.stringify(byPlatforms, {
        space: '    ',
        quote: '"'
    }))
})
