import React, {useRef} from 'react';
import {FieldState, FormState} from "formstate";
import {required} from "../../utils/validators";
import {action, observable, runInAction} from "mobx";
import {store} from "../../service";
import {observer} from "mobx-react-lite";
import {Button, Segment} from "semantic-ui-react";
import "./styles.scss";
import {TextField} from "../../components_v0/widgets/formstate_components";

type SignInForm = {
    username: FieldState<string>
    password: FieldState<string>
}

class SignInState {
    form: FormState<SignInForm>;
    @observable error = "";

    constructor() {
        this.form = new FormState<SignInForm>({
            username: new FieldState("").validators(required()),
            password: new FieldState("").validators(required())
        })
    }

    @action submit = async () => {
        const {hasError} = await this.form.validate();
        if (hasError) return;
        const res = await store().account.trySignIn(this.form.$.username.$, this.form.$.password.$);
        if (res) {
            runInAction(() => this.error = res.message);
            return false;
        } else {
            const router = store().ui.router;
            const returnTo = router.getState().params['returnTo'];
            if (returnTo) {
                const returnToState = router.matchPath(returnTo);
                if (returnToState) {
                    router.navigate(returnToState.name);
                    return;
                }
            }
            router.navigate('home')
        }
    }

}

const Screen = observer(({returnTo}: { returnTo: string }) => {
    const {current: store} = useRef(new SignInState());

    return <div className="login pos">
        <Segment className="login panel">
            <TextField name="username" fieldState={store.form.$.username} label={'Username'}
                       displayErrors={false}/>
            <TextField password name="password" fieldState={store.form.$.password} label={'Password'}
                       displayErrors={false}/>
            {store.error && <Segment className="login errormsg" color="red">{store.error}</Segment>}
            <Button className="login button" primary onClick={store.submit} disabled={store.form.hasError}>Login</Button>
        </Segment>
    </div>
});

export default Screen;