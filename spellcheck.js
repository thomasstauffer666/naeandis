import koffi from 'koffi';

// TODO ffi-napi fails
// TODO make module
// TODO destructor?

const lib = koffi.load('libhunspell-1.7.so.0');

const sizeOfPointer = koffi.sizeof('char*');

const Hunspell_create = lib.func('void *Hunspell_create(const char* affpath, const char* dpath)');
const Hunspell_destroy = lib.func('void Hunspell_destroy(void *spell)');
const Hunspell_spell = lib.func('bool Hunspell_spell(void *spell, const char* word)');
const Hunspell_suggest = lib.func('int Hunspell_suggest(void *spell, char***slst, const char* word)');
const Hunspell_free_list = lib.func('void Hunspell_free_list(void *spell, char* **list, int n)');
const Hunspell_add = lib.func('int Hunspell_add(void *spell, const char* word)');

const hunspell = Hunspell_create("/usr/share/hunspell/de_CH_frami.aff", "/usr/share/hunspell/de_CH_frami.dic");

function encode(str) {
  console.assert(typeof str === 'string');
  const result = new Uint8Array([...Buffer.from(str, 'latin1'), 0]);
  console.assert(result instanceof Uint8Array);
  return result;
}

function convertFromHunspellEncoding(str) {
  return str;
}

export function add(words) {
  for (const word of words) {
    const wordEncoded = encode(word);
    Hunspell_add(hunspell, wordEncoded);
  }
}

export function spell(word) {
  const wordEncoded = encode(word);
  const isCorrect = Hunspell_spell(hunspell, wordEncoded);
  return isCorrect;
}

export function suggest(word) {
  const wordEncoded = encode(word);
  const pointerToListOfChars = koffi.alloc('char**', 1);
  const count = Hunspell_suggest(hunspell, pointerToListOfChars, wordEncoded);
  const listOfchars = koffi.decode(pointerToListOfChars, 'char**');
  const suggestions = [];
  for (let i = 0; i < count; i += 1) {
    const s2 = koffi.decode(listOfchars, i * sizeOfPointer, koffi.pointer('uint8'));
    const s3 = koffi.decode(s2, koffi.array('uint8', 128));
    const end = s3.indexOf(0);
    console.assert(end >= 0);
    const s5 = Buffer.from(s3.slice(0, end)).toString('latin1');

    suggestions.push(convertFromHunspellEncoding(s5));
  }
  Hunspell_free_list(hunspell, pointerToListOfChars, count);
  return suggestions;
}
