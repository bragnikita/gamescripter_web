import React from 'react';
import {getStore} from "../../stores/root";
import * as _ from "lodash";

interface DictionaryValueProps {
    dict: string,
    value?: string,
    defaultValue?: string,
    as?: React.ComponentType | string
}

export const DictionaryValue = ({dict, value, defaultValue, as = "span"}: DictionaryValueProps) => {
    let dictionary = getStore().dictionaries.all.get(dict);
    if (dictionary) {
        const dictRecord = _.find(dictionary.records, (v) => v.parameter === value);
        if (dictRecord) {
            return <span>{dictRecord.title}</span>
        }
    }
    if (defaultValue) {
        return <span>{defaultValue}</span>;
    }
    return null;
};