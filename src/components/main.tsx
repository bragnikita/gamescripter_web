import React, {ReactNode, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useRoute} from "react-router5";
import {AppNavigationConfig, RouteConfig} from "../routing";
import {State} from "router5";
import {CenteredLoader} from "../components_v0/widgets/loaders";
import {PrivateLayout} from "./layouts";

export const Main = ({cfg}: { cfg: AppNavigationConfig }) => {

    const {route} = useRoute();

    if (!route) {
        return <CenteredLoader global/>;
    }


    const config = cfg.getConfig(route.name);

    let screen;
    if (!config) {
        screen = cfg.getFallbackScreen();
        if (screen) {
            return <React.Fragment>{screen.render(route)}</React.Fragment>
        } else {
            return null;
        }
    }

    const layout = config.options.layout || "default";
    if (layout === 'public') {
        return <div className="public_layout">
            <ScreenRenderer r={config} s={route}/>
        </div>
    }
    return <PrivateLayout>
        <ScreenRenderer r={config} s={route}/>
    </PrivateLayout>;
};

const ScreenRenderer = ({r, s}: { r: RouteConfig, s: State }) => {

    const [loading, setLoading] = useState(false);
    const cancelled = useRef(false);

    useLayoutEffect(() => {
        const exec = async () => {
            if (r.beforeCallback) {
                setLoading(true);
                await r.beforeCallback(s);
                if (!cancelled.current) {
                    setLoading(false)
                }
            }
        };
        if (!cancelled.current) {
            exec();
        }
        return () => { cancelled.current = true }
    }, [r, s]);

    if (!r.screen) {
        return null;
    }
    if (loading) {
        return <CenteredLoader/>
    }
    return <React.Fragment>{r.screen.render(s)}</React.Fragment>
};

export function timeout(ms: number, result: any): any {
    return new Promise(resolve => setTimeout(() => resolve(result), ms));
}