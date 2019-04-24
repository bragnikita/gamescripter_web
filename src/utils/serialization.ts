import {ClassType} from "class-transformer/ClassTransformer";
import {classToPlain, ClassTransformOptions, plainToClass, plainToClassFromExist} from "class-transformer";
import _ from 'lodash';

export function jsonToClassSingle<T, V>(cls: ClassType<T>, plain: V, options?: ClassTransformOptions) {
    if (_.isArray(plain)) {
        const arr = plainToClass(cls, plain, options);
        if (_.isArray(arr)) {
            return arr[0]
        } else {
            return arr;
        }
    }
    return plainToClass(cls, plain, options);
}
export function jsonToObjectSingle<T, V>(obj: T, plain: V, options?: ClassTransformOptions) {
    return plainToClassFromExist(obj, plain, options);
}
export function objectToJson<T, V>(obj: T, options?: ClassTransformOptions) {
    return classToPlain(obj, options);
}