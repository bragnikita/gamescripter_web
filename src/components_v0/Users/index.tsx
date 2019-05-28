import React from 'react';
import {observer} from "mobx-react";
import {AsyncStoreView} from "../widgets/async_store_view";
import {getStore} from "../../stores/root";
import {User} from "../../stores/users";
import {Button, Divider, Form, Icon, Image, Segment} from "semantic-ui-react";
import './styles.scss';
import {TextField} from "../widgets/formstate_components";

interface Props {
}

@observer
export class UsersManagementScreen extends React.Component<Props, {}> {

    render() {
        return <React.Fragment>
            <Segment className="app users_screen">
                <Segment textAlign="right" basic>
                    <Button color="green" icon="plus" content="ADD USER"
                            onClick={() => getStore().users.setForm()}
                    />
                </Segment>
                <UserAddEditForm/>
                <Divider/>
                <AsyncStoreView
                    substore={getStore().users}
                    render={(users) => <Table items={users}/>}
                />
            </Segment>
        </React.Fragment>
    }
}

const Table = observer(({items}: { items: User[] }) => {
    return <Segment.Group>
        {items.map((user: User) => {
            return <Segment className={"itemlist item"} key={user.id}>
                <div className={"avatar"}>
                    {user.avatar_uri ?
                        <Image avatar src={user.avatar_uri}/>
                        :
                        <Icon name={"user circle outline"} size={"big"}/>
                    }
                </div>
                <div className="itemlist content">
                    <div className="primary">{user.display_name || user.username}</div>
                    <div className="secondary">
                        @{user.username}
                    </div>
                </div>
                <div className="actions">
                    <Button circular icon="edit" onClick={() => user.edit()}/>
                </div>
            </Segment>
        })
        }
    </Segment.Group>
});

const UserAddEditForm = observer((props: any) => {
    const form = getStore().users.form;
    const user = getStore().users.selected;
    if (!form || !user) { return null }
    return <React.Fragment>
        <div className={"app form-inline"}>
            <TextField name="username" label={"Username"} required fieldState={form.$.username}/>
            <TextField name="password" label={"Password"} required fieldState={form.$.password}/>
        </div>
        <div className="d-flex justify-content-end">
            <Button icon="check" circular color="green" disabled={form.hasError} onClick={getStore().users.save}/>
            <Button icon="cancel" circular color="red" onClick={getStore().users.unselect}/>
        </div>
    </React.Fragment>
});