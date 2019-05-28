import React from 'react';
import {observer} from "mobx-react";
import {Button, Segment} from "semantic-ui-react";
import AceEditor from 'react-ace';
import {getStore} from "../../stores/root";
import {ClassicScriptStore, Script} from "../../stores/scripts";
import "./styles.scss";
import 'brace/theme/github';
import {SyncSelector, TextField} from "../widgets/formstate_components";
import {observable, reaction} from "mobx";
import {NavButton} from "../widgets/buttons";
import {ScriptReader} from "../Reader";


@observer
export default class EditorScreen extends React.Component<{}, {}> {
    private store: ClassicScriptStore;
    private previewInsert = React.createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);
        this.store = getStore().classic_scripts;
        // reaction(() => this.store.previewHtml, (html) => {
        //     if (!this.previewInsert.current) return;
        //     if (html) {
        //         console.log('inserting html', html.substr(0, 50));
        //         this.previewInsert.current.innerHTML = html;
        //     } else {
        //         this.previewInsert.current.innerHTML = '';
        //     }
        // }, {name: 'preview update'})
    }

    render() {
        return <div className="classic-editor_layout">
            <Segment className="app form-wrapper">
                <TextField
                    name="title"
                    fieldState={this.store.form.$.title}
                    placeholder="Title"
                    required
                />
                <div className="app form-inline">
                    <SyncSelector label={"Type"} state={this.store.form.$.type} className={"w-small"}
                                  options={getStore().dictionaries.getAsDropdownOptions('script_types')}/>
                </div>
            </Segment>
            <Segment className="app hlist-container left-right block-controls">
                <div>
                    <NavButton to="categories.one" params={{id: this.store.script.existed.category_id}}>
                        Close
                    </NavButton>
                </div>
                <div>
                    <span>{this.store.opState.statusMessage}</span>
                    <span>{this.store.opState.error && this.store.opState.error.toString()}</span>
                    <Button
                        loading={this.store.opState.inProcess}
                        primary
                        content="Save"
                        onClick={this.store.onUpdate}
                    />
                    <Button primary content="Preview"
                            loading={this.store.opState.inProcess}
                            onClick={this.store.onPreview}
                    />
                </div>
            </Segment>
            <Segment className="block-editor">
                <div className="__editor">
                    <AceEditor
                        theme={"github"}
                        name={"script-text-input"}
                        onChange={this.store.form.$.script.onChange}
                        value={this.store.form.$.script.value}
                        width={"100%"}
                        minLines={20}
                        maxLines={Infinity}
                        focus
                        highlightActiveLine
                        wrapEnabled
                        showPrintMargin={false}
                    />
                </div>
                <div className="__preview">
                    <ScriptReader script={this.store.preview} imagesExt="jpg" resourcesPrefix={this.store.resources_prefix}/>
                </div>
            </Segment>
            <Segment className="block-attachments">

            </Segment>
        </div>
    }
}