import React, {Component} from 'react';
import './App.css';
import {Router} from "react-router";
import DevTools from "mobx-react-devtools";
import NotificationSystem from 'react-notification-system';
import {
    ApiTokenService,
    BrowserLocalStorage,
    Router5BasedLocationSevice,
    SimpleNotificationService
} from "./services/appservices";
import ContentArea from "./components/Main";
import {RouterStore, syncHistoryWithStore} from "mobx-react-router";
import {createBrowserHistory} from "history";
import {getStore, setAppStore} from "./stores/root";
import {AccountStore} from "./stores/account";
import AppServices, {AppServicesHolder} from "./services";
import HttpServiceBackend from "./services/httpService";
import {UsersStore} from "./stores/users";
import CategoriesStore from "./stores/categories";
import {CategoriesApi} from "./api/resource_apis";
import {DictionariesStore} from "./stores/dictionaries";
import {UiState} from "./stores/uistate";
import {makeMobxRouter, makeNotLoggedInPlugin} from "./routing";
import defaultRoutesDefs from "./routes";
import {reaction} from "mobx";
import {ClassicScriptStore} from "./stores/scripts";

const notificationService = new SimpleNotificationService;

const routerStore = new RouterStore();
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, routerStore);

const ui = new UiState();
const router = makeMobxRouter(defaultRoutesDefs, ui);
const navigationService = new Router5BasedLocationSevice(router);


const storageService = new BrowserLocalStorage();
const tokenService = new ApiTokenService("x-access-token", storageService);

const httpServiceFactory = new HttpServiceBackend(tokenService, navigationService);
const clientInstance = httpServiceFactory.serviceInstance;


const servicesHolder = AppServicesHolder.instance();

servicesHolder.http = clientInstance;
servicesHolder.storage = storageService;
servicesHolder.token = tokenService;
servicesHolder.notification = notificationService;
servicesHolder.location = navigationService;

setAppStore({
    account: new AccountStore(clientInstance),
    users: new UsersStore(clientInstance),
    categories: new CategoriesStore(new CategoriesApi(clientInstance)),
    dictionaries: new DictionariesStore(),
    classic_scripts: new ClassicScriptStore(),
    ui: ui,
});

router.usePlugin(makeNotLoggedInPlugin(() => getStore().account.isLoggedIn));
router.start();

reaction(() => getStore().account.account, async (user) => {
    if (!user) return;
    await getStore().dictionaries.preLoad();
});


// For easier debugging with Chrome Dev Tools
if (process.env.NODE_ENV === 'development') {
    (window as any)['__APPSTORE__'] = getStore();
    (window as any)['__SERVICES__'] = AppServices;
}


class App extends Component {
    render() {
        return (
            <Router history={history}>
                <React.Fragment>
                    <ContentArea/>
                    <DevTools
                        position={
                            {
                                top: -2,
                                right: 200,
                            }}
                    />
                    <NotificationSystem ref={(ref: NotificationSystem.System) => notificationService.setRef(ref)}/>
                </React.Fragment>
            </Router>
        );
    }
}

export default App;
