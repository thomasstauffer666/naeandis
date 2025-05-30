
import fs from 'fs/promises';
import path from 'path';
import jsdom from 'jsdom';

async function getHtmlFilePaths() {
    const dir = '.';
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter($ => $.name.endsWith('.html')).map($ => path.join(dir, $.name));
}

function unique(arr) {
    return [...new Set(arr)];
}

async function main() {
    const htmlFilePaths = await getHtmlFilePaths();
    for (const htmlFilePath of htmlFilePaths) {
        const html = await fs.readFile(htmlFilePath, 'utf-8');
        const dom = new jsdom.JSDOM(html);

        dom.window.document.querySelectorAll('[data-table]').forEach(node => {
            node.textContent = '\n' + unique(node.textContent.split(',').map($ => $.trim()).filter(Boolean)).sort((l, r) => r.localeCompare(l, 'de')).join(',\n') + '\n';
        });

        await fs.writeFile(htmlFilePath, dom.serialize(), 'utf-8');
    }
}

await main();
