import React, {Component} from 'react';
import './App.css';
import {Router} from "react-router";
import DevTools from "mobx-react-devtools";
import NotificationSystem from 'react-notification-system';
import {
    ApiTokenService,
    BrowserLocalStorage,
    RouterBasedLocationService,
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
import {makeMobxRouter} from "./routing";
import routes from "./routes";

const notificationService = new SimpleNotificationService;

const routerStore = new RouterStore();
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, routerStore);
const navigationService = new RouterBasedLocationService(routerStore);

const storageService = new BrowserLocalStorage();
const tokenService = new ApiTokenService("x-access-token", storageService);

const httpServiceFactory = new HttpServiceBackend(tokenService, navigationService);
const clientInstance = httpServiceFactory.serviceInstance;


const servicesHolder = AppServicesHolder.instance();

servicesHolder.http = clientInstance;
servicesHolder.location = navigationService;
servicesHolder.storage = storageService;
servicesHolder.token = tokenService;
servicesHolder.notification = notificationService;

setAppStore({
    account: new AccountStore(clientInstance),
    users: new UsersStore(clientInstance),
    categories: new CategoriesStore(new CategoriesApi(clientInstance)),
    dictionaries: new DictionariesStore(),
    ui: new UiState(),
});

// For easier debugging with Chrome Dev Tools
if (process.env.NODE_ENV === 'development') {
    (window as any)['__APPSTORE__'] = getStore();
    (window as any)['__SERVICES__'] = AppServices;
}

const router = makeMobxRouter(routes, getStore());
router.start();

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
