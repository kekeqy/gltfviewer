/**
 * 执行Promise
 * @param {Promise} promise 
 * @returns {Promise<[Error,*]>}
 */
export async function to(promise) {
    return promise.then(data => [undefined, data]).catch(err => [err, undefined]);
}