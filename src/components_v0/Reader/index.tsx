import React from 'react';
import {observer} from "mobx-react-lite";
import {Script} from "../../stores/scripts";
import {getStore} from "../../stores/root";
import {CenteredLoader} from "../widgets/loaders";
import './reader.css'
import "./menu_button.png"
import './styles.scss'
import {Category} from "../../stores/categories";
import _ from "lodash";
import {NavButton, NavLink} from "../widgets/buttons";
import {CategoryButton} from "./menu";
import $ from 'jquery';

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
    return <div className="reader story">
        {!readonly &&
        <div className={"app top-nav hlist-container left"}>
            {category.parent_id &&
            <NavButton to="reader.category" params={{id: category.parent_id}} basic>
                Top
            </NavButton>
            }
            <NavButton to="categories.one" params={{id: category.id}} icon="edit"/>
        </div>
        }
        {readonly &&
        <React.Fragment>
            <div className={"nav_header"}>
                {category.parent_id && <TopNav to={"reader.category"} params={{id: category.parent_id}} name="Back"/>}
                <CategoryHeader title={category.title} subtitle={category.subtitle}/>
            </div>
        </React.Fragment>
        }
        {category.children.length > 0 &&
        <CategoriesMenu category={category}/>
        }
        {scripts.map((s) => {
            return <ScriptReader key={s.id} script={s}
                                 resourcesPrefix={category.resources_prefix || category.defaultResourcesPrefix}/>
        })}
    </div>
});

export default ReaderScreen

export interface ScriptReaderProps {
    script: Script,
    resourcesPrefix?: string
    imagesExt?: string
}

export class ScriptReader extends React.Component<ScriptReaderProps, {}> {

    static defaultProps = {
        resourcesPrefix: "",
        imagesExt: ".jpg"
    };

    htmlInsertRef = React.createRef<HTMLDivElement>();

    constructor(props: ScriptReaderProps) {
        super(props);
    }


    render() {
        const insertIntoId = `script_position_${this.props.script.id}`;

        return <div className={"script_reader"}>
            {this.props.script.title &&
            <div className={"battle_devider"}>
                <hr/>
                <span>{this.props.script.title}</span>
                <hr/>
            </div>
            }
            <div className={"story"} id={insertIntoId} ref={this.htmlInsertRef}/>
        </div>
    }

    componentDidUpdate(): void {
        this.insert()
    }

    insert(): void {
        if (!this.props.script.html) return;
        const jq = $(this.props.script.html);
        if (this.props.resourcesPrefix) {
            jq.find('.image img').each((i, e) => {
                const $el = $(e);
                let target = $el.attr('src');
                if (!target || (target.startsWith('http') || target.startsWith('/'))) {
                    return;
                }
                if (target.startsWith("./")) {
                    target = target.substr(2)
                }
                if (!target.match(/.+\.(png|jpg|jpeg)$/)) {
                    target = target + this.props.imagesExt
                }
                let pref = this.props.resourcesPrefix || "";
                if (!pref.endsWith('/')) {
                    pref = pref + "/"
                }
                $el.attr('src', pref + target)
            });
        }
        const c = this.htmlInsertRef.current;
        if (c) {
            c.innerHTML = jq[0].innerHTML;
        }
    }

    componentDidMount(): void {
        this.insert();
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

const CategoryHeader = ({title, subtitle = ""}: { title: string, subtitle?: string }) => {

    if (subtitle) {
        if (!subtitle.match(/.+[.!?;)~]$/)) {
            subtitle = subtitle + "."
        }
        if (subtitle.trimEnd().length === subtitle.length) {
            subtitle = subtitle + " "
        }
    }

    return <div className="top_title">
      <span className="text">
          {subtitle}{title}
      </span>
    </div>
};

const TopNav = ({name = "Back", to, params = {}}: { name?: string, to: string, params?: any }) => {
    return <NavLink to={to} params={params}>
        <div className="menu"><span>{name}</span></div>
    </NavLink>
};