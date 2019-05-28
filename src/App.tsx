import React, {Component} from 'react';
import './App.css';
import DevTools from "mobx-react-devtools";
import NotificationSystem from 'react-notification-system';
import {SimpleNotificationService} from "./services/appservices";
import {Dev} from "./utils/dev";
import {RouterProvider} from "react-router5";
import createRouter from "router5";
import {Main} from "./components/main";
import browserPlugin from "router5-plugin-browser";
import {authControlMiddleware, configure} from "./routes";

const notificationService = new SimpleNotificationService;


const router = createRouter([], {
    defaultRoute: "not_found",
    queryParamsMode: "loose",
    allowNotFound: false
});
router.usePlugin(browserPlugin());
router.subscribe(state => Dev.printO(state));
router.useMiddleware(authControlMiddleware.middlewareFactory);
const screensConfig = configure(router);
if (Dev.exposeGlobal()) {
    (window as any)['__ROUTER__'] = router;
}

setTimeout(() => {
    router.start(window.location.pathname == "/" ? '/home' : window.location.pathname + window.location.search);
}, 2000);

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
