/**
 * 生成一个指定长度的GUID字符串
 * @param {string} length 长度
 * @returns {string} GUID字符串
 */
export function newGuid(length) {
    let guid = '';
    while (length--) {
        guid += Math.floor(Math.random() * 16.0).toString(16);
    }
    return guid.toUpperCase();
}
/**
 * 生成一个8位长度的GUID字符串
 * @returns {string} GUID字符串
 */
export function newGuid8() {
    return newGuid(8);
}
/**
 * 生成一个16位长度的GUID字符串
 * @returns {string} GUID字符串
 */
export function newGuid16() {
    return newGuid(16);
}
/**
 * 生成一个32位长度的GUID字符串
 * @returns {string} GUID字符串
 */
export function newGuid32() {
    return newGuid(32);
}