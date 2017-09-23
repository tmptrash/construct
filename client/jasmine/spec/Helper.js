export default class Helper {
    static compare(arr1, arr2) {
        if (arr1.length !== arr2.length) {return false}
        return !arr1.some((a) => arr2.indexOf(a) === -1)
    }
}
