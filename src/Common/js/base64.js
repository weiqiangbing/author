/**
* UTF16��UTF8ת�����ձ�
* U+00000000 �C U+0000007F   0xxxxxxx
* U+00000080 �C U+000007FF   110xxxxx 10xxxxxx
* U+00000800 �C U+0000FFFF   1110xxxx 10xxxxxx 10xxxxxx
* U+00010000 �C U+001FFFFF   11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
* U+00200000 �C U+03FFFFFF   111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
* U+04000000 �C U+7FFFFFFF   1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
*/
export var Base64 = {
    // ת���
    table : [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
            'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'w', 'x', 'y', 'z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9', '+', '/',
            '='
    ],
    UTF16ToUTF8 : function(str) {
        var res = [], len = str.length;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            if (code > 0x0000 && code <= 0x007F) {
                // ���ֽڣ����ﲢ������0x0000����Ϊ���ǿ��ֽ�
                // U+00000000 �C U+0000007F  0xxxxxxx
                res.push(str.charAt(i));
            } else if (code >= 0x0080 && code <= 0x07FF) {
                // ˫�ֽ�
                // U+00000080 �C U+000007FF  110xxxxx 10xxxxxx
                // 110xxxxx
                var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                // 10xxxxxx
                var byte2 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1), 
                    String.fromCharCode(byte2)
                );
            } else if (code >= 0x0800 && code <= 0xFFFF) {
                // ���ֽ�
                // U+00000800 �C U+0000FFFF  1110xxxx 10xxxxxx 10xxxxxx
                // 1110xxxx
                var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                // 10xxxxxx
                var byte2 = 0x80 | ((code >> 6) & 0x3F);
                // 10xxxxxx
                var byte3 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1), 
                    String.fromCharCode(byte2), 
                    String.fromCharCode(byte3)
                );
            } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                // ���ֽ�
                // U+00010000 �C U+001FFFFF  11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                // ���ֽ�
                // U+00200000 �C U+03FFFFFF  111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                // ���ֽ�
                // U+04000000 �C U+7FFFFFFF  1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }
 
        return res.join('');
    },
    UTF8ToUTF16 : function(str) {
        var res = [], len = str.length;
        var i = 0;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            // var code = str.charCodeAt(i);
            // �Ե�һ���ֽڽ����ж�
            if (((code >> 7) & 0xFF) == 0x0) {
                // ���ֽ�
                // 0xxxxxxx
                res.push(str.charAt(i));
            } else if (((code >> 5) & 0xFF) == 0x6) {
                // ˫�ֽ�
                // 110xxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var byte1 = (code & 0x1F) << 6;
                var byte2 = code2 & 0x3F;
                var utf16 = byte1 | byte2;
                res.push(Sting.fromCharCode(utf16));
            } else if (((code >> 4) & 0xFF) == 0xE) {
                // ���ֽ�
                // 1110xxxx 10xxxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var code3 = str.charCodeAt(++i);
                var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                var utf16 = ((byte1 & 0x00FF) << 8) | byte2
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 3) & 0xFF) == 0x1E) {
                // ���ֽ�
                // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (((code >> 2) & 0xFF) == 0x3E) {
                // ���ֽ�
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                // ���ֽ�
                // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }
 
        return res.join('');
    },
    encodeU16 : function(str) {
        if (!str) {
            return '';
        }
        var utf8    = this.UTF16ToUTF8(str); // ת��UTF8
        var i = 0; // ��������
        var len = utf8.length;
        var res = [];
        while (i < len) {
            var c1 = utf8.charCodeAt(i++) & 0xFF;
            res.push(this.table[c1 >> 2]);
            // ��Ҫ��2��=
            if (i == len) {
                res.push(this.table[(c1 & 0x3) << 4]);
                res.push('==');
                break;
            }
            var c2 = utf8.charCodeAt(i++);
            // ��Ҫ��1��=
            if (i == len) {
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(this.table[(c2 & 0x0F) << 2]);
                res.push('=');
                break;
            }
            var c3 = utf8.charCodeAt(i++);
            res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
            res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
            res.push(this.table[c3 & 0x3F]);
        }
 
        return res.join('');
    },
    decodeU16 : function(str) {
        if (!str) {
            return '';
        } 
        var len = str.length;
        var i   = 0;
        var res = []; 
        while (i < len) {
            var code1 = this.table.indexOf(str.charAt(i++));
            code2 = this.table.indexOf(str.charAt(i++));
            code3 = this.table.indexOf(str.charAt(i++));
            code4 = this.table.indexOf(str.charAt(i++));
 
            c1 = (code1 << 2) | (code2 >> 4);
            c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
            c3 = ((code3 & 0x3) << 6) | code4;
 
            res.push(String.fromCharCode(c1));
 
            if (code3 != 64) {
                res.push(String.fromCharCode(c2));
            }
            if (code4 != 64) {
                res.push(String.fromCharCode(c3));
            }
 
        }
 
        return this.UTF8ToUTF16(res.join(''));
    },
    encodeU8:function(input){
        input=excape(input);
        var output="";
        var chr1,chr2,chr3;
        var enc1,enc2,enc3,enc4;
        while(i<input.length){
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
               this.table[enc1]+
               this.table[enc2] +
               this.table[enc3] +
               this.table[enc4];
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        }
        return output;
    },
    decodeU8:function(input){
        var output = [];
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            alert("There were invalid base64 characters in the input text.\n" +
                  "Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='\n" +
                  "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length){
            enc1 = this.table.indexOf(input.charAt(i++));
            enc2 = this.table.indexOf(input.charAt(i++));
            enc3 = this.table.indexOf(input.charAt(i++));
            enc4 = this.table.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output.push(chr1);

            if (enc3 != 64) {
                output.push(chr2);
            }
            if (enc4 != 64) {
                output.push(chr3);
            }
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        }
        return output;
    },
    decodeToBytes : function(str) {
        if (!str) {
            return '';
        }
        str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var i   = 0;
        var res = []; 
        while (i < str.length) {
            var code1 = this.table.indexOf(str.charAt(i++));
            var code2 = this.table.indexOf(str.charAt(i++));
            var code3 = this.table.indexOf(str.charAt(i++));
            var code4 = this.table.indexOf(str.charAt(i++)); 
            var c1 = (code1 << 2) | (code2 >> 4);
            var c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
            var c3 = ((code3 & 0x3) << 6) | code4;
            res.push(c1);
            if (code3 != 64) {
                res.push(c2);
            }
            if (code4 != 64) {
                res.push(c3);
            }
        } 
        return res;
    }
};
 