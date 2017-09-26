export default class Helper {
    static compare(arr1, arr2) {
        if (arr1.length !== arr2.length) {return false}
        return !arr1.some((a) => arr2.indexOf(a) === -1)
    }

    static waitFor(obj, cb, timeout = 10000) {
        let times = 0;
        let id    = setInterval(() => {
            if (times > timeout / 50) {throw 'Waiting time is over'}
            if (obj.done) {
                clearInterval(id);
                cb();
            }
            times++;
        }, 50);
    }
}