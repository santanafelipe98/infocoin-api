export enum Operator {
    GREATER_THAN_OR_EQUAL,
    LESS_THAN_OR_EQUAL
}

export interface ILogicalOperation<T> {
    execute: (valueA: T, valueB: T) => boolean
}

export function logicalOperation<T>(operator: Operator): ILogicalOperation<T>  {
    const fn = {
        [Operator.GREATER_THAN_OR_EQUAL]: (valueA: T, valueB: T) => valueA >= valueB,
        [Operator.LESS_THAN_OR_EQUAL]: (valueA: T, valueB: T) => valueA <= valueB
    };

    if (!fn[operator])
        throw new TypeError("Invalid operator!");

    return {
        execute: fn[operator]
    }
}