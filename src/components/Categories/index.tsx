import React from 'react';
import {observer} from "mobx-react-lite";
import {observer as Observer} from "mobx-react";
import {getStore} from "../../stores/root";
import CategoriesStore, {Category} from "../../stores/categories";
import {CenteredLoader} from "../widgets/loaders";
import {Button, Divider, Form, Segment} from "semantic-ui-react";
import {SyncSelector, TextArea, TextField} from "../widgets/formstate_components";
import AppServices from "../../services";

@Observer
export class CategoriesViewScreen extends React.Component<{}, {}> {

    render() {
        const store = getStore().categories;
        if (store.currentCategory.loading) {
            return <CenteredLoader/>
        }
        if (!store.currentCategory.exists()) {
            return null;
        }
        return <React.Fragment>
            <CategoriesAddressLine/>
            <CategoryEditor/>
            <CategoriesList store={getStore().categories}/>
        </React.Fragment>
    };
}

const CategoryEditor = observer((props: any) => {
    const store = getStore().categories;
    const form = store.editorStore.form;
    if (!store.editorStore.visible) {
        return <Segment className={"app form-buttons-right"}>
            <Button onClick={store.newOne}>Create category</Button>
            <Button>Create script</Button>
        </Segment>
    }
    return <Segment className="">
        <Form className="app form-wrapper">
            <TextField name="title" label={"Title"} required fieldState={form.$.title}/>
            <TextArea name="description" label={"Description"} fieldState={form.$.description}/>
            <div className={"app form-inline form-component"}>
                <SyncSelector label={"Type"} state={form.$.grouping_type} options={store.getDict('category_types')}/>
                {form.$.grouping_type.$ === 'story' &&
                <SyncSelector label={"Story"} state={form.$.grouping_type} options={store.getDict('category_types')}/>
                }
            </div>
        </Form>
        <div className={"app form-buttons"}>
            <Button primary onClick={() => store.save()}>Save</Button>
            <Button secondary
                    onClick={() => store.editorStore.show(false)}>
                Cancel
            </Button>
        </div>
    </Segment>
});

const CategoriesAddressLine = observer((props: any) => {

    return <div>Address</div>
});

const CategoriesList = observer(({store}: { store: CategoriesStore }) => {
    if (store.currentCategory.loading) {
        return <CenteredLoader/>
    }
    const cat = store.currentCategory.existed;
    return <div className="app list category_content_list __wrapper">
        <Divider horizontal content="Categories"/>
        {cat.children.length == 0 &&
        <div>No subcategories. <Button onClick={store.newOne}>Create one</Button></div>
        }
        {cat.children.map((c: Category) => <CategoryItem cat={c} key={c.id}/>)}
        <Divider horizontal content="Scripts"/>
        {cat.scripts.length == 0 &&
        <div>No scripts</div>
        }
        {cat.scripts.map((c: any) => <ScriptItem s={c} key={c.id}/>)}
    </div>
});

const CategoryItem = ({cat}: { cat: Category }) => (
    <div className="__category_item d-flex justify-content-between">
        <span className="app vcenter">{cat.title}</span>
        <span>
          <Button onClick={() => AppServices.location.push(`/categories/${cat.id}`)}>Show</Button>
          <Button>Edit</Button>
      </span>
    </div>
);
const ScriptItem = ({s}: { s: any }) => (
    <div className="__script_item d-flex justify-content-between">
        <span className="app vcenter">{s.title}</span>
        <span/>
    </div>
);