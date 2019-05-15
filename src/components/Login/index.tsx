import React from 'react';
import './styles.scss';
import {AccountStore} from "../../stores/account";
import {getStore} from "../../stores/root";
import {TextField} from "../widgets/formstate_components";
import {Button, Segment} from "semantic-ui-react";
import {observer} from "mobx-react-lite";

const Login = observer(({store}: { store: AccountStore }) => {

    return <div className="login pos">
        <Segment className="login panel">
            <TextField name="username" fieldState={store.loginForm.$.username} label={'Username'}
                       displayErrors={false}/>
            <TextField password name="password" fieldState={store.loginForm.$.password} label={'Password'}
                       displayErrors={false}/>
            {store.errorMessage && <Segment className="login errormsg" color="red">{store.errorMessage}</Segment>}
            <Button className="login button" primary onClick={store.tryLogin} disabled={store.loginForm.hasError}>Login</Button>
        </Segment>
    </div>
});

export default () => <Login store={getStore().account}/>;