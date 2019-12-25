export class UtilsFuncs {
    static deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}