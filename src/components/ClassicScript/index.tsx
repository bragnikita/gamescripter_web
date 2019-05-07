import React from 'react';
import {observer} from "mobx-react";
import {Button, Segment} from "semantic-ui-react";
import AceEditor from 'react-ace';
import {getStore} from "../../stores/root";
import {ClassicScriptStore} from "../../stores/scripts";
import "./styles.scss";
import 'brace/theme/github';
import {TextField} from "../widgets/formstate_components";


@observer
export default class EditorScreen extends React.Component<{}, {}> {
    private store: ClassicScriptStore;

    constructor(props: any) {
        super(props);
        this.store = getStore().classic_scripts;
    }

    render() {
        return <div className="classic-editor_layout">
            <Segment className="app form-wrapper">
                <TextField
                    name="title"
                    fieldState={this.store.form.$.title}
                    label={"Title"}
                    required
                />
            </Segment>
            <Segment className="app form-buttons-left block-controls">
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
            </Segment>
            <Segment className="block-editor">
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
            </Segment>
            <Segment className="block-attachments">

            </Segment>
        </div>
    }
}