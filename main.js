
import fs from 'fs/promises';
import path from 'path';
import jsdom from 'jsdom';
import * as spellcheck from './spellcheck.js'

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

function containsInvalid(text) {
    const re = /[^\x00-\x7FÄÖÜäöüéÉ✓✗➭🎲💗💡⚡️]/gu;
    return re.test(text);
}

const strangeWords = [
    'freund',
    'jedermann',
    'jemand',
    'man',
    'niemand',
];

const NAMEN = [
    'Bella',
    'Cai',
    'Hops',
    'Kiko',
    'Pavel',
    'Piri',
    'Quinn',
    'Raul',
    'Sid',
    'Tili',
    'Umar',
    'Wala',
    'Wilda',
    'Winnie',
    'Wuschel',
];

spellcheck.add([
    ...NAMEN,
    'Aronia',
    'Axolotl',
    'Bache',
    'Cubes',
    'Digeridoo',
    'Dixit',
    'Durian',
    'Erzählspiel',
    'Fähe',
    'Gspänli',
    'Kitsungi',
    'Koi',
    'Marimba',
    'Melodica',
    'Naeandis',
    'Ocarina',
    'Okapi',
    'Orca',
    'Pangolin',
    'Pedalo',
    'Silvaria',
    'Thalassa',
]);

async function htmlAnalyze() {
    const htmlFilePaths = await getFilePaths('.html');
    for (const htmlFilePath of htmlFilePaths) {
        const htmlInput = await fs.readFile(htmlFilePath, 'utf-8');
        const dom = new jsdom.JSDOM(htmlInput, { includeNodeLocations: true });
        const document = dom.window.document;

        // sort all data-table entries
        document.querySelectorAll('[data-table]').forEach(node => {
            node.textContent = '\n' + unique(node.textContent.split(',').map($ => $.trim()).filter(Boolean)).sort((l, r) => r.localeCompare(l, 'de')).join(',\n') + '\n';
        });

        // to some degree also normalizes HTML
        const htmlOutput = dom.serialize();

        if (htmlInput != htmlOutput) {
            await fs.writeFile(htmlFilePath, htmlOutput, 'utf-8');
        }

        const walker = document.createTreeWalker(document.body, dom.window.NodeFilter.SHOW_TEXT, null, false);

        let node = null;
        while (node = walker.nextNode()) {
            const text = node.textContent;
            const words = getWords(text);
            const wordsLowerCase = words.map($ => $.toLowerCase());

            const l = dom.nodeLocation(node);
            // TODO why?
            const location = htmlFilePath + ':' + (l === undefined ? '?' : l.startLine);

            if (containsInvalid(text)) {
                console.log('StrangeLetters', location);
            }

            const spellCheckAttribute = node.parentElement.getAttribute('data-spellcheck');
            const shouldSpellCheck = (spellCheckAttribute === null) || (spellCheckAttribute.toLowerCase() !== 'false');

            if (shouldSpellCheck) {
                for (const word of words) {
                    if (!spellcheck.spell(word)) {
                        console.log('WrongWord', location, word, spellcheck.suggest(word).join(', '));
                    }
                }
            }

            for (const strangeWord of strangeWords) {
                if (wordsLowerCase.includes(strangeWord)) {
                    console.log('StrangeWord', location, strangeWord);
                }
            }
        }
    }
}

async function main() {
    await htmlAnalyze();
}

await main();
