import React, {ReactNode} from "react";
import {Route, Switch} from "react-router";
import Login from "../Login";
import AdminHeader from "../AdminHeader";
import './styles.scss';
import {UsersManagementScreen} from "../Users";
import {CategoriesViewScreen} from "../Categories";

export default class ContentArea extends React.Component<any, {}> {

    render() {
        return <React.Fragment>
            <Switch>
                <Route exact path="/login"
                       render={() => <Login/>}/>
                <Route path="/editor/:id" render={() => <div>Editor</div>}/>
                <Route render={() =>
                    <div className="top app-container">
                        <AdminHeader/>
                        <div className="top content-layout ui extra top_menu_margin">
                            {screenMargins(
                                <Switch>
                                    <Route path="/users"
                                           render={() => narrow(<UsersManagementScreen/>)}
                                    />
                                    <Route path={'/categories/:id'}
                                           render={({match}) => narrow(<CategoriesViewScreen category_id={match.params['id']}/>)}
                                    />
                                    <Route path={'/categories'} exact

                                           render={() => narrow(<CategoriesViewScreen category_id=""/>)}
                                    />
                                </Switch>
                            )}
                        </div>
                    </div>
                }/>
            </Switch>
        </React.Fragment>
    }
}

const narrow = (e: ReactNode) => {
    return <div className="top screen_patterns narrow">{e}</div>
};
const screenMargins = (e: ReactNode) => {
    return <div className="top screen_patterns basic">{e}</div>
};