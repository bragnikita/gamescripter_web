import React from 'react';
import {SyncSelector} from "../../components_v0/widgets/formstate_components";
import {FieldState} from "formstate";
import {store} from "../../service";
import {TextValuePair} from "../../stores/types";
import {Button, Dropdown} from "semantic-ui-react";
import {observer} from "mobx-react-lite";


export const DictionarySelector = (props: {
    label: string, state: FieldState<string>, dictName: string
}) => {
    let opts: TextValuePair[] = [];
    const dict = useDictionarySync(props.dictName);
    if (dict) {
        opts = dict.getAsDropdownOptions();
    }
    return <SyncSelector label={props.label} state={props.state} options={opts}/>
};

export const DictionaryMultipleSelector = observer((props: {
    label: string, state: FieldState<string[]>, dictName: string, placeholder: string,
}) => {
    let opts: TextValuePair[] = [];
    const dict = useDictionarySync(props.dictName);
    if (dict) {
        opts = dict.getAsDropdownOptions();
    }

    return <div className="app hlist-container form-component">
        <Dropdown fluid multiple selection placeholder={props.placeholder}
                  value={props.state.value}
                  onChange={(e, {value}) => props.state.onChange(value as any)}
                  options={opts}
        />
    </div>
});

const useDictionarySync = (name: string) => {
    return store().dictionaries.getSync(name)
};