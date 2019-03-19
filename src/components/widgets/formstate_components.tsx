import React from "react";
import {Checkbox, Dropdown, DropdownItemProps, Input, TextArea as Text} from "semantic-ui-react";
import {FieldState} from "formstate";
import {observer} from "mobx-react";
import './formstate_components.scss';
import {AsyncSubStore} from "../../stores/types";
import classNames from "classnames";

interface TextFieldProps {
    label?: string,
    name: string,
    password?: boolean,
    wrapperClass?: string,
    displayErrors?: boolean,
    required?: boolean,
    fieldState: FieldState<string>
}

export const TextField = observer(({
                                       password = false, label, name, wrapperClass, displayErrors = true, required = false, fieldState
                                   }: TextFieldProps) => {

    return <div className={classNames('app textfield', wrapperClass)}>
        <FieldLabel label={label} required={required}/>
        <Input type={password ? 'password' : 'text'}
               fluid
               required={required}
               error={fieldState.hasError && displayErrors}
               name={name}
               value={fieldState.value}
               onChange={(e, data) => fieldState.onChange(data.value)}
               onBlur={fieldState.enableAutoValidationAndValidate}
        />
        <FieldError state={fieldState} displayError={displayErrors}/>
    </div>
});

export const TextArea = observer(({
                                      label, name, wrapperClass, displayErrors = true, required = false, fieldState
                                  }: TextFieldProps) => {

    return <div className={`mbv_textarea ${wrapperClass || ''}`}>
        <FieldLabel label={label} required={required}/>
        <Text type="text"
               required={required}
               name={name}
               value={fieldState.value}
               onChange={(e, data) => fieldState.onChange(data.value + '')}
               onBlur={fieldState.enableAutoValidationAndValidate}
        />
        <FieldError state={fieldState} displayError={displayErrors}/>
    </div>
});

export const Toggle = observer(({state, label, ...props}: {
                                    state: FieldState<boolean>,
                                    label: string,
                                    [key: string]: any
                                }
) => {
    return <Checkbox toggle
                     label={label}
                     checked={state.value}
                     onChange={(e, {checked}) =>
                         state.onChange(checked as boolean)
                     }
                     {...props}
    />
});

interface SyncSelectorProps<T> {
    options: DropdownItemProps[],
    state: FieldState<any>,
    label?: string,

    [key: string]: any
}

export const SyncSelector = observer(<T extends any>(props: SyncSelectorProps<T>) => {
    const {options, state} = props;
    return <Dropdown selection
                     options={options}
                     value={state.value as any}
                     onChange={(e, {value}) => state.onChange(value as any)}
    />

});

export interface AsyncSelectorProps<Obj> {
    label?: string,
    required?: boolean,

    optsStore: AsyncSubStore<Obj>,

    optToValue(opt: Obj): any,

    optToText(opt: Obj): string,

    state: FieldState<any>
}

const buildOptions = <Obj extends {}>(items: Obj[],
                                      optToValue: (opt: Obj) => any,
                                      optToText: (opt: Obj) => string): DropdownItemProps[] => {
    return items.map((item: Obj) => {
        const key = optToValue(item);
        const text = optToText(item);
        return {
            value: key,
            key: key,
            text: text,
        }
    });
};

const FieldLabel = ({label, required = false}: { label?: string, required?: boolean }) => {
    if (label) {
        return <label className="d-block app form-label">{label}{required ? '*' : ''}</label>
    }
    return null;
};

const FieldError = observer(({state, displayError=true}: { state: FieldState<any>, displayError?: boolean }) => {
    if (state.hasError && displayError) {
        return <small className="d-block small text-danger">{state.error}</small>
    }
    return null;
});

export const FormStateAsyncSelector = observer(<K extends {}, Key>(props: AsyncSelectorProps<K>) => {
    const {label, required = false, state, optToValue, optToText, optsStore} = props;
    const hasValue = !optsStore.fetching && !optsStore.error;
    const opts = hasValue ? buildOptions(optsStore.items, optToValue, optToText) : [];
    return <div>
        <FieldLabel label={label} required={required}/>
        <Dropdown selection
                  loading={optsStore.fetching}
                  error={!!optsStore.error || state.hasError}
                  value={state.value}
                  options={opts}
                  onChange={(e, data) => {
                      state.onChange(data.value);
                  }}
        />
        <FieldError state={state}/>
    </div>
});

