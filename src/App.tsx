import React, {Component} from 'react';
import './App.css';
import DevTools from "mobx-react-devtools";
import NotificationSystem from 'react-notification-system';
import {SimpleNotificationService} from "./services_v0/appservices";
import {Dev} from "./utils/dev";
import {RouterProvider} from "react-router5";
import {Main} from "./components/main";
import {configure} from "./routes";
import {http, store} from "./service";

const notificationService = new SimpleNotificationService;

const router = store().ui.router;
const screensConfig = configure(router);

if (Dev.exposeGlobal()) {
    (window as any)['__ROUTER__'] = router;
    (window as any)['__STORE__'] = store();
    (window as any)['__HTTP__'] = http();
}

store().account.tryAutoSignIn().finally(() => {
    router.start(window.location.pathname == "/" ? '/home' : window.location.pathname + window.location.search);
});
// setTimeout(() => {
//     router.start(window.location.pathname == "/" ? '/home' : window.location.pathname + window.location.search);
// }, 2000);

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="top app-container">
                    <RouterProvider router={router}>
                        <Main cfg={screensConfig}/>
                    </RouterProvider>
                </div>
                {Dev.showDevTools() && <DevTools
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
