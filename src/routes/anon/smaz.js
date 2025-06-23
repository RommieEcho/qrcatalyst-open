// @ts-nocheck
// Custom compression/decompression for JavaScript
/* Our compression codebook, used for compression */
const Smaz_cb = [
"\x02s,\xb6", "\x03had\x9a\x02leW", "\x03on \x8e", "", "\x01yS",
"\x02ma\xad\x02li\x97", "\x03or \xb0", "", "\x02ll\x98\x03s t\xbf",
"\x04fromg\x02mel", "", "\x03its\xda", "\x01z\xdb", "\x03ingF", "\x01>\xde",
"\x01 \x00\x03   (\x02nc\xe4", "\x02nd=\x03 on\xca",
"\x02ne\x8b\x03hat\xbe\x03re q", "", "\x02ngT\x03herz\x04have\xc6\x03s o\x95",
"", "\x03ionk\x03s a\xac\x02ly\xea", "\x03hisL\x03 inN\x03 be\xaa", "",
"\x03 fo\xd5\x03 of \x03 ha\xc9", "", "\x02of\x05",
"\x03 co\xa1\x02no\xb7\x03 ma\xf8", "", "", "\x03 cl\xee\x03enta\x03 an7",
"\x02ns\xc0\x01\"e", "\x03n t\x8f\x02ntP\x03s, \x85",
"\x02pe\xd0\x03 we\xe9\x02om\x93", "\x02on\x1f", "", "\x02y G", "\x03 wa\xb9",
"\x03 re\xd1\x02or*", "", "\x02=\"\xa9\x02ot\xdf", "\x03forD\x02ou[",
"\x03 toR", "\x03 th\r", "\x03 it\xf6",
"\x03but\xb1\x02ra\x82\x03 wi\xf3\x02</\xf1", "\x03 wh\x9f", "\x02  4",
"\x03nd ?", "\x02re!", "", "\x03ng c", "",
"\x03ly \xc7\x03ass\xd3\x01a\x04\x02rir", "", "", "", "\x02se_", "\x03of \"",
"\x03div\xf4\x02ros\x03ere\xa0", "", "\x02ta\xc8\x01bZ\x02si\xd4", "",
"\x03and\x07\x02rs\xdd", "\x02rt\xf2", "\x02teE", "\x03ati\xce", "\x02so\xb3",
"\x02th\x11", "\x02tiJ\x01c\x1c\x03allp", "\x03ate\xe5", "\x02ss\xa6",
"\x02stM", "", "\x02><\xe6", "\x02to\x14", "\x03arew", "\x01d\x18",
"\x02tr\xc3", "", "\x01\n1\x03 a \x92", "\x03f tv\x02veo", "\x02un\xe0", "",
"\x03e o\xa2", "\x02a \xa3\x02wa\xd6\x01e\x02", "\x02ur\x96\x03e a\xbc",
"\x02us\xa4\x03\n\r\n\xa7", "\x02ut\xc4\x03e c\xfb", "\x02we\x91", "", "",
"\x02wh\xc2", "\x01f,", "", "", "", "\x03d t\x86", "", "", "\x03th \xe3",
"\x01g;", "", "", "\x01\r9\x03e s\xb5", "\x03e t\x9c", "", "\x03to Y",
"\x03e\r\n\x9e", "\x02d \x1e\x01h\x12", "", "\x01,Q", "\x02 a\x19", "\x02 b^",
"\x02\r\n\x15\x02 cI", "\x02 d\xa5", "\x02 e\xab", "\x02 fh\x01i\x08\x02e \x0b",
"", "\x02 hU\x01-\xcc", "\x02 i8", "", "", "\x02 l\xcd", "\x02 m{",
"\x02f :\x02 n\xec", "\x02 o\x1d", "\x02 p}\x01.n\x03\r\n\r\xa8", "",
"\x02 r\xbd", "\x02 s>", "\x02 t\x0e", "", "\x02g \x9d\x05which+\x03whi\xf7",
"\x02 w5", "\x01/\xc5", "\x03as \x8c", "\x03at \x87", "", "\x03who\xd9", "",
"\x01l\x16\x02h \x8a", "", "\x02, $", "", "\x04withV", "", "", "", "\x01m-", "",
"", "\x02ac\xef", "\x02ad\xe8", "\x03TheH", "", "", "\x04this\x9b\x01n\x09",
"", "\x02. y", "", "\x02alX\x03e, \xf5", "\x03tio\x8d\x02be\\",
"\x02an\x1a\x03ver\xe7", "", "\x04that0\x03tha\xcb\x01o\x06", "\x03was2",
"\x02arO", "\x02as.", "\x02at'\x03the\x01\x04they\x80\x05there\xd2\x05theird",
"\x02ce\x88", "\x04were]", "", "\x02ch\x99\x02l \xb4\x01p<", "", "",
"\x03one\xae", "", "\x03he \x13\x02dej", "\x03ter\xb8", "\x02cou", "",
"\x02by\x7f\x02di\x81\x02eax", "", "\x02ec\xd7", "\x02edB", "\x02ee\xeb", "",
"", "\x01r\x0c\x02n )", "", "", "", "\x02el\xb2", "", "\x03in i\x02en3", "",
"\x02o `\x01s\n", "", "\x02er\x1b", "\x03is t\x02es6", "", "\x02ge\xf9",
"\x04.com\xfd", "\x02fo\xdc\x03our\xd8", "\x03ch \xc1\x01t\x03", "\x02hab", "",
"\x03men\xfc", "", "\x02he\x10", "", "", "\x01u&", "\x02hif", "",
"\x03not\x84\x02ic\x83", "\x03ed @\x02id\xed", "", "", "\x02ho\xbb",
"\x02r K\x01vm", "", "", "", "\x03t t\xaf\x02il\xf0", "\x02im\xe2",
"\x03en \xcf\x02in\x0f", "\x02io\x90", "\x02s \x17\x01wA", "", "\x03er |",
"\x03es ~\x02is%", "\x02it/", "", "\x02iv\xba", "",
"\x02t #\x07http://C\x01x\xfa", "\x02la\x89", "\x01<\xe1", "\x03, a\x94"
];

/* Reverse compression codebook, used for decompression */
const Smaz_rcb = [
" ", "the", "e", "t", "a", "of", "o", "and", "i", "n", "s", "e ", "r", " th",
" t", "in", "he", "th", "h", "he ", "to", "\r\n", "l", "s ", "d", " a", "an",
"er", "c", " o", "d ", "on", " of", "re", "of ", "t ", ", ", "is", "u", "at",
"   ", "n ", "or", "which", "f", "m", "as", "it", "that", "\n", "was", "en",
"  ", " w", "es", " an", " i", "\r", "f ", "g", "p", "nd", " s", "nd ", "ed ",
"w", "ed", "http://", "for", "te", "ing", "y ", "The", " c", "ti", "r ", "his",
"st", " in", "ar", "nt", ",", " to", "y", "ng", " h", "with", "le", "al", "to ",
"b", "ou", "be", "were", " b", "se", "o ", "ent", "ha", "ng ", "their", "\"",
"hi", "from", " f", "in ", "de", "ion", "me", "v", ".", "ve", "all", "re ",
"ri", "ro", "is ", "co", "f t", "are", "ea", ". ", "her", " m", "er ", " p",
"es ", "by", "they", "di", "ra", "ic", "not", "s, ", "d t", "at ", "ce", "la",
"h ", "ne", "as ", "tio", "on ", "n t", "io", "we", " a ", "om", ", a", "s o",
"ur", "li", "ll", "ch", "had", "this", "e t", "g ", "e\r\n", " wh", "ere",
" co", "e o", "a ", "us", " d", "ss", "\n\r\n", "\r\n\r", "=\"", " be", " e",
"s a", "ma", "one", "t t", "or ", "but", "el", "so", "l ", "e s", "s,", "no",
"ter", " wa", "iv", "ho", "e a", " r", "hat", "s t", "ns", "ch ", "wh", "tr",
"ut", "/", "have", "ly ", "ta", " ha", " on", "tha", "-", " l", "ati", "en ",
"pe", " re", "there", "ass", "si", " fo", "wa", "ec", "our", "who", "its", "z",
"fo", "rs", ">", "ot", "un", "<", "im", "th ", "nc", "ate", "><", "ver", "ad",
" we", "ly", "ee", " n", "id", " cl", "ac", "il", "</", "rt", " wi", "div",
"e, ", " it", "whi", " ma", "ge", "x", "e c", "men", ".com"
];

function smaz_compress(input, maxOutLen = null) {
    const inBytes = new TextEncoder().encode(input);
    const inlen = inBytes.length;
    let outBytes = [];
    let inPos = 0;
    let verb = [];
    let verblen = 0;

    while (inPos < inlen) {
        let j = 7;
        let flush = null;
        let slot;
        
        // Calculate hash values
        const h1 = (inBytes[inPos] << 3) % 241;
        const h2 = inPos + 1 < inlen ? ((inBytes[inPos] << 3) + inBytes[inPos + 1]) % 241 : h1;
        const h3 = inPos + 2 < inlen ? (h2 ^ inBytes[inPos + 2]) % 241 : h2;
        
        if (j > inlen - inPos) j = inlen - inPos;

        // Try to lookup substrings into the hash table
        let found = false;
        for (; j > 0 && !found; j--) {
            switch(j) {
                case 1: slot = Smaz_cb[h1]; break;
                case 2: slot = Smaz_cb[h2]; break;
                default: slot = Smaz_cb[h3]; break;
            }
            
            let slotPos = 0;
            while (slotPos < slot.length && slot.charCodeAt(slotPos) !== 0) {
                const slotLen = slot.charCodeAt(slotPos);
                if (slotLen === j) {
                    // Check if the substring matches
                    let matches = true;
                    for (let k = 0; k < j; k++) {
                        if (slot.charCodeAt(slotPos + 1 + k) !== inBytes[inPos + k]) {
                            matches = false;
                            break;
                        }
                    }
                    
                    if (matches) {
                        // Match found - flush verbatim bytes if needed
                        if (verblen > 0) {
                            if (verblen === 1) {
                                outBytes.push(254);
                                outBytes.push(verb[0]);
                            } else {
                                outBytes.push(255);
                                outBytes.push(verblen - 1);
                                outBytes.push(...verb);
                            }
                            verb = [];
                            verblen = 0;
                        }
                        
                        // Emit the compressed byte
                        outBytes.push(slot.charCodeAt(slotPos + slotLen + 1));
                        inPos += j;
                        found = true;
                        break;
                    }
                }
                slotPos += slotLen + 2;
            }
        }
        
        if (!found) {
            // Match not found - add byte to verbatim buffer
            verb.push(inBytes[inPos]);
            verblen++;
            inPos++;
        }
        
        // Flush if we reached the limit or end of input
        if (verblen === 256 || (verblen > 0 && inPos >= inlen)) {
            if (verblen === 1) {
                outBytes.push(254);
                outBytes.push(verb[0]);
            } else {
                outBytes.push(255);
                outBytes.push(verblen - 1);
                outBytes.push(...verb);
            }
            verb = [];
            verblen = 0;
        }
        
        // Check max output length if specified
        if (maxOutLen && outBytes.length > maxOutLen) {
            return null; // Output too large
        }
    }
    
    return new Uint8Array(outBytes);
}

function smaz_decompress(compressedBytes) {
    const inBytes = new Uint8Array(compressedBytes);
    let outBytes = [];
    let inPos = 0;
    
    while (inPos < inBytes.length) {
        const c = inBytes[inPos];
        
        if (c === 254) {
            // Verbatim byte
            outBytes.push(inBytes[inPos + 1]);
            inPos += 2;
        } else if (c === 255) {
            // Verbatim string
            const len = inBytes[inPos + 1] + 1;
            for (let i = 0; i < len; i++) {
                outBytes.push(inBytes[inPos + 2 + i]);
            }
            inPos += 2 + len;
        } else {
            // Codebook entry
            const s = Smaz_rcb[c];
            if (s) {
                const bytes = new TextEncoder().encode(s);
                outBytes.push(...bytes);
            }
            inPos++;
        }
    }
    
    return new TextDecoder().decode(new Uint8Array(outBytes));
}

export { smaz_compress, smaz_decompress };