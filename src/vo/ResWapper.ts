export class ResWapper<T> {
    public code: number;
    public msg: string;
    public data: T;

    public static success<T>(data: T) {
        const res = new ResWapper();
        res.code = 0;
        res.msg = '';
        res.data = data;
        return res;
    }

    public static fail<T>(code: number, msg: string) {
        const res = new ResWapper();
        res.code = code;
        res.msg = msg;
        res.data = null;
        return res;
    }
}
