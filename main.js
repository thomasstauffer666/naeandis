
import fs from 'fs/promises';
import path from 'path';
import jsdom from 'jsdom';
import sharp from 'sharp';

async function getFilePaths(ext) {
    const dir = '.';
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter($ => $.name.endsWith(ext)).map($ => path.join(dir, $.name));
}

function unique(arr) {
    return [...new Set(arr)];
}

function getWords(text) {
    const re = /[\p{L}]+/gu;
    return Array.from(text.matchAll(re), word => word[0]);
}

const strangeLetters = ['ß', '—', '–'];
const strangeWords = ['man', 'jemand', 'niemand', 'freund', 'jedermann'];

async function htmlAnalyze() {
    const htmlFilePaths = await getFilePaths('.html');
    for (const htmlFilePath of htmlFilePaths) {
        const htmlInput = await fs.readFile(htmlFilePath, 'utf-8');
        const dom = new jsdom.JSDOM(htmlInput);
        const document = dom.window.document;

        // sort all data-table entries
        document.querySelectorAll('[data-table]').forEach(node => {
            node.textContent = '\n' + unique(node.textContent.split(',').map($ => $.trim()).filter(Boolean)).sort((l, r) => r.localeCompare(l, 'de')).join(',\n') + '\n';
        });

        const walker = document.createTreeWalker(document.body, dom.window.NodeFilter.SHOW_TEXT, null, false);

        let node = null;
        while (node = walker.nextNode()) {
            const text = node.textContent.toLowerCase();
            const words = getWords(text);

            for (const strangeLetter of strangeLetters) {
                if (text.includes(strangeLetter)) {
                    console.log('StrangeLetter', htmlFilePath, strangeLetter);
                }
            }

            for (const strangeWord of strangeWords) {
                if (words.includes(strangeWord)) {
                    console.log('StrangeWord', htmlFilePath, strangeWord);
                }
            }
        }

        // to some degree also normalizes HTML
        const htmlOutput = dom.serialize();

        if (htmlInput != htmlOutput) {
            await fs.writeFile(htmlFilePath, htmlOutput, 'utf-8');
        }
    }
}

async function main() {
    await htmlAnalyze();
}

await main();
