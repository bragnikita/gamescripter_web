import React from 'react';
import {observer} from "mobx-react-lite";
import {Script} from "../../stores/scripts";
import {getStore} from "../../stores/root";
import {CenteredLoader} from "../widgets/loaders";
import './reader.css'
import './styles.scss'
import {Category} from "../../stores/categories";
import _ from "lodash";
import {NavButton} from "../widgets/buttons";
import {CategoryButton} from "./menu";

const ReaderScreen = observer((props: any) => {
    const store = getStore().reader_store;
    const readonly = store.readOnly()
    if (store.categoryState.inProcess) {
        return <CenteredLoader/>
    }
    const category = store.currentCategory;
    if (!category) {
        return null;
    }
    const scripts = category.scripts;
    return <div className="reader">
        <div className={"app top-nav hlist-container left"}>
            {category.parent_id &&
            <NavButton to="reader.category" params={{id: category.parent_id}} basic>
                Top
            </NavButton>
            }
            {!readonly && <NavButton to="categories.one" params={{id: category.id}} icon="edit" /> }
        </div>
        <div>
            <span className={"app text-4"}>{category.title}</span>
        </div>
        {category.children.length > 0 &&
        <CategoriesMenu category={category}/>
        }
        {scripts.map((s) => {
            return <ScriptReader key={s.id} script={s}/>
        })}
    </div>
});

export default ReaderScreen

interface ScriptReaderProps {
    script: Script,
}

class ScriptReader extends React.Component<ScriptReaderProps, {}> {

    htmlInsertRef = React.createRef<HTMLDivElement>();

    constructor(props: ScriptReaderProps) {
        super(props);
    }


    render() {
        const insertIntoId = `script_position_${this.props.script.id}`;

        return <div className={"script_reader"}>
            {this.props.script.title &&
            <div className={"title"}>
                {this.props.script.title}
            </div>
            }
            <div className={"story"} id={insertIntoId} ref={this.htmlInsertRef}/>
        </div>
    }

    componentDidMount(): void {
        const c = this.htmlInsertRef.current;
        if (c) {
            c.innerHTML = this.props.script.html;
        }
    }
}

const CategoriesMenu = ({category}: { category: Category }) => {

    const categories = _.sortBy(category.children, (c: Category) => c.index);

    return <div className="reader categories_menu">
        {categories.length == 0 && <div className="__no_categories">This category is empty</div>}
        <div className="__list">
            {categories.map((c: Category) => {
                return <CategoryButton key={c.id} title={c.title} id={c.id} subtitle={c.subtitle}/>
            })}
        </div>
    </div>
};