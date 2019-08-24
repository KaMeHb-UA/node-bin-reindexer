import fromJSON from './json6downloader.mjs'

export default async () => {
    const idx = await fromJSON('https://nodejs.org/download/release/index.json');
    return idx
}
