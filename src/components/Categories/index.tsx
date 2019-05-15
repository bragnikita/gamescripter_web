import React from 'react';
import {observer} from "mobx-react-lite";
import {observer as Observer} from "mobx-react";
import {getStore} from "../../stores/root";
import CategoriesStore, {Category} from "../../stores/categories";
import {CenteredLoader} from "../widgets/loaders";
import {Button, Divider, Form, Label, Segment} from "semantic-ui-react";
import {SyncSelector, TextArea, TextField} from "../widgets/formstate_components";
import AppServices from "../../services";
import {DictionaryValue} from "../widgets/dictionaries";
import {NavButton} from "../widgets/buttons";

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
            <CategoryInfo cat={store.currentCategory.existed}/>
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
            <NavButton to={'reader.category'} params={{id: store.currentCategory.existed.id}} returnTo>Show</NavButton>
            <Button onClick={store.newOne}>Create category</Button>
            <Button onClick={store.createScript}>Create script</Button>
        </Segment>
    }
    return <Segment className="">
        <Form className="app form-wrapper">
            <TextField name="title" label={"Title"} required fieldState={form.$.title}/>
            <TextField name="subtitle" label={"Subtitle"} fieldState={form.$.subtitle}/>
            <TextArea name="description" label={"Description"} fieldState={form.$.description}/>
            <div className={"app form-inline form-component"}>
                <SyncSelector label={"Type"} state={form.$.content_type} options={store.getDict('category_types')}/>
                {form.$.content_type.$ === 'story' &&
                <SyncSelector label={"Story"} state={form.$.story_type} options={store.getDict('story_types')}/>
                }
            </div>
        </Form>
        <div className={"app form-buttons"}>
            <Button primary onClick={() => store.save()} disabled={store.editorStore.form.hasError}>Save</Button>
            <Button secondary
                    onClick={() => store.editorStore.show(false)}>
                Cancel
            </Button>
        </div>
    </Segment>
});

const CategoryInfo = observer(({cat}: { cat: Category }) => {
    return <div className="category-info">
        <h1>{cat.title}</h1>
        <div className="app hlist-container">
            <Label tag color={"red"}><DictionaryValue dict="category_types" value={cat.content_type}/></Label>
            {cat.content_type === 'story' &&
            <Label tag color={"green"}><DictionaryValue dict="story_types" value={cat.story_type}/></Label>
            }
        </div>
    </div>
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
        <div className="app vlist-container">
            {cat.children.map((c: Category) => <CategoryItem cat={c} key={c.id}/>)}
        </div>
        <Divider horizontal content="Scripts"/>
        {cat.scripts.length == 0 &&
        <div>No scripts</div>
        }
        <div className="app vlist-container">
            {cat.scripts.map((c: any) => <ScriptItem s={c} key={c.id}/>)}
        </div>
    </div>
});

const CategoryItem = ({cat}: { cat: Category }) => (
    <div className="__category_item d-flex justify-content-between">
        <span className="app vcenter">{cat.title}</span>
        <span>
          <Button onClick={() => AppServices.location.push('categories.one', {id: cat.id})}>Show</Button>
          <Button onClick={() => getStore().categories.editorStore.setUpForm(cat)}>Edit</Button>
          <Button color="red" icon="trash" onClick={() => getStore().categories.remove(cat.id)} />
      </span>
    </div>
);
const ScriptItem = ({s}: { s: any }) => (
    <div className="__script_item d-flex justify-content-between">
        <span className="app vcenter">{s.title}</span>
        <span>
            <Button onClick={() => AppServices.location.push('script_editor_classic-edit', {id: s.id})}>Edit</Button>
            <Button color="red" icon="trash" onClick={async () => {
                await getStore().classic_scripts.onRemove(s.id)
                await getStore().categories.setUp(getStore().categories.currentCategory.existed.id)
            }} />
        </span>
    </div>
);