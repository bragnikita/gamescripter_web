import React, {Component} from 'react';
import './App.css';
import DevTools from "mobx-react-devtools";
import NotificationSystem from 'react-notification-system';
import {
    ApiTokenService,
    BrowserLocalStorage,
    Router5BasedLocationSevice,
    SimpleNotificationService
} from "./services/appservices";
import ContentArea from "./components/Main";
import {getStore, setAppStore} from "./stores/root";
import {AccountStore} from "./stores/account";
import AppServices, {AppServicesHolder} from "./services";
import HttpServiceBackend from "./services/httpService";
import {UsersStore} from "./stores/users";
import CategoriesStore from "./stores/categories";
import {CategoriesApi} from "./api/resource_apis";
import {DictionariesStore} from "./stores/dictionaries";
import {UiState} from "./stores/uistate";
import {AccessControlMiddleware, createTransitionMiddlewareFactory, makeMobxRouter} from "./routing";
import defaultRoutesDefs from "./routes";
import {ClassicScriptStore} from "./stores/scripts";
import {ReaderStore} from "./stores/reader";

const notificationService = new SimpleNotificationService;

const router = makeMobxRouter(defaultRoutesDefs);
const ui = new UiState(router);
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
    reader_store: new ReaderStore(),
    ui: ui,
});

httpServiceFactory.configuredRequestController.onNeedAuthentication = () => {
    if (getStore().account.isLoggedIn) {
        AppServices.notify.message({name: "app.need_relogin" })
    } else {}
};

router.useMiddleware(
    new AccessControlMiddleware().createMiddleware,
    createTransitionMiddlewareFactory(defaultRoutesDefs, ui)
);
router.start();
ui.applicationInitState.catchIt(async () => {
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
            <React.Fragment>
                <div className="top app-container">
                    <ContentArea/>
                </div>
                {process.env.NODE_ENV === 'development' && <DevTools
                    position={
                        {
                            top: -2,
                            right: 200,
                        }}
                />}
                <NotificationSystem ref={(ref: NotificationSystem.System) => notificationService.setRef(ref)}/>
            </React.Fragment>
        );
    }
}

export default App;
