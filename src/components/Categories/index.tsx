import React, {useEffect, useRef} from 'react';
import {Breadcrumb, Button, Divider, Header, List, Modal, Segment} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {action, observable} from "mobx";
import {Category} from "../../stores/categories";
import {Screen} from "../../routing";
import {State} from "router5";
import {store} from "../../service";
import {Script} from "../../stores/scripts";
import {CatForm} from "./form";

export class ScreenModel implements Screen {
    private category: Category | undefined = undefined;
    before = async (to: State) => {
        this.category = await store().categories.getCategory(to.params.id)
    };
    render = () => {
        if (!this.category) {
            return null;
        }
        return <ScreenComponent category={this.category}/>
    }

}

class Model {
    @observable editDialogOpened = false;

    category: Category;
    categoryToEdit: Category | undefined;

    @action editOne = (category: Category) => {
        this.categoryToEdit = category;
        this.editDialogOpened = true;
    };
    @action createNew = () => {
        this.categoryToEdit = new Category();
        this.editDialogOpened = true;
    };
    @action onEditFinished = async (result: "updated" | "added" | "cancelled") => {
        this.editDialogOpened = false;
    };

    constructor(c: Category) {
        this.category = c;
    }
}

const ScreenComponent = observer(({category}: { category: Category }) => {

    const {current: store} = useRef(new Model(category));

    return <div className="screen categories">
        <CategoriesBreadcrumb/>
        <Segment className="overview">
            <Header size={"large"}>{category.title}</Header>
            <Header size={"small"}>{category.subtitle}</Header>
            <Segment basic>{category.description}</Segment>
            <Divider/>
            <Segment basic className="app hlist-container left-right">
                <Button color="green" icon="plus" onClick={store.createNew} content="Add"/>
                <Button primary icon="pencil" content="Edit" onClick={() => store.editOne(category)}/>
            </Segment>
        </Segment>
        <div className="list">
            {category.children.length > 0 && <div>
                <Divider horizontal content="Categories"/>
                <CategoriesList categories={category.children} onSelect={store.editOne}/>
            </div>
            }
            {category.scripts.length > 0 && <div>
                <Divider horizontal content="Scripts"/>
                <ScriptsList scripts={category.scripts}/>
            </div>
            }
        </div>
        <EditCreatePopUp
            category={store.categoryToEdit}
            opened={store.editDialogOpened}
            onFinish={store.onEditFinished}
        />
    </div>

});

const CategoriesBreadcrumb = ({forCategoryId}: { forCategoryId?: string }) => {
    return <Breadcrumb/>
};

const CategoriesList = ({categories, onSelect}: {
    categories: Category[],
    onSelect: (c: Category) => void
}) => {
    return <div>
        {categories.map((c, index) => {
            return <Segment className={"app hlist-container left-right"}>
                <div><span className="app text-3">{c.title}</span></div>
                <div className="app hlist-container">
                    <span>Contributors, status</span>
                    <Button basic icon="pencil" onClick={() => onSelect(c)}/>
                    <Button basic icon="eye"/>
                </div>
            </Segment>
        })}
    </div>
};
const ScriptsList = ({
                         scripts, onSelect = () => {
    }
                     }: {
    scripts: Script[],
    onSelect?: (c: Script) => void
}) => {

    return <div/>
};

const EditCreatePopUp = ({category, opened, onFinish}: {
    category?: Category,
    opened: boolean,
    onFinish: (result: "updated" | "added" | "cancelled") => Promise<void>
}) => {
    useEffect(() => {
        if (!category) {
            onFinish('cancelled')
        }
    }, [category]);
    if (!category) {
        return null;
    }
    return <Modal
        open={opened}
        onClose={async () => await onFinish("cancelled")}
    >
        <Modal.Header>
            {category.id ? "Edit category" : "New category"}
        </Modal.Header>
        <Modal.Content>
            <CatForm category={category} onActionDone={async (action, category) => {
                console.log(action);
                onFinish("cancelled");
            }}/>
        </Modal.Content>
    </Modal>
};

