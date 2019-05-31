import {Category} from "../../stores/categories";
import {Button, Form} from "semantic-ui-react";
import React, {useRef} from "react";
import {FieldState, FormState} from "formstate";
import {SyncSelector, TextArea, TextField} from "../../components_v0/widgets/formstate_components";
import {DictionaryMultipleSelector, DictionarySelector} from "../Basic/forms";
import {observer} from "mobx-react-lite";
import {required} from "../../utils/validators";
import {action} from "mobx";

export type FormAction = "update" | "create" | "delete" | "cancel"

type FormStruct = {
    title: FieldState<string>,
    subtitle: FieldState<string>,
    description: FieldState<string>,
    content_type: FieldState<string>,
    story_type: FieldState<string>,
    index: FieldState<number>,
    resources_prefix: FieldState<string>,
    previous_category: FieldState<string>,
    contributors: FieldState<string[]>,
    status: FieldState<string>,
}

class FormModel {
    form: FormState<FormStruct>
    model: Category;

    constructor(c: Category) {
        this.model = c;
        this.form = new FormState({
            title: new FieldState(c.title).validators(required()),
            subtitle: new FieldState(c.subtitle),
            description: new FieldState(c.description),
            content_type: new FieldState(c.content_type),
            story_type: new FieldState(c.meta['story_type'] || ""),
            index: new FieldState(c.index),
            resources_prefix: new FieldState(c.resources_prefix),
            previous_category: new FieldState(""),
            contributors: new FieldState([] as string[]),
            status: new FieldState("")
        })
    }

    @action save = async (cb: (a: FormAction, c?: Category) => Promise<void>) => {
        const {hasError} = await this.form.validate();
        if (!hasError) {
            if (this.model.isNew) {
                await cb("create", this.model)
            } else {
                await cb("update", this.model);
            }
        }
    }

}

export const CatForm = observer(({category, onActionDone}: {
    category: Category,
    onActionDone(action: FormAction, category?: Category): Promise<void>
}) => {
    const {current: store} = useRef(new FormModel(category));
    const form = store.form;

    return <div>
        <Form className="app form-wrapper">
            <TextField name="title" label={"Title"} required fieldState={form.$.title}/>
            <TextField name="subtitle" label={"Subtitle"} required fieldState={form.$.subtitle}/>
            <TextArea name="description" label={"Description"} fieldState={form.$.description}/>
            <div className={"app form-inline form-component"}>
                <DictionarySelector label={"Type"} state={form.$.content_type} dictName={'category_types'}/>
                {form.$.content_type.$ === 'story' &&
                <DictionarySelector label={"Story"} state={form.$.story_type} dictName={'story_types'}/>
                }
            </div>
            <TextField name="res_pref" label={"Images uri prefix"} fieldState={form.$.resources_prefix}/>
            <DictionarySelector label={"Status"} state={form.$.status} dictName={'status'}/>
            <DictionaryMultipleSelector label={"Contributors"} state={form.$.contributors} dictName={"story_types"} placeholder={"Contributors"}/>
        </Form>
        <div className="app hlist-container center mt-3">
            <Button secondary content={"Cancel"} onClick={() => onActionDone("cancel", category)}/>
            {category.isNew &&
            <Button color="green" icon="save" content={"Update"} onClick={() => store.save(onActionDone)}/>}
            {!category.isNew &&
            <Button color="green" icon="save" content={"Create"} onClick={() => store.save(onActionDone)}/>}
        </div>
    </div>
});