import {inspect} from "util";

type Action = "console" | "devtools" | "expose_global"

class DevDelegate {
    printO = (arg: any) => {
        if (!this.allow('console')) return;

        if (typeof arg === 'object') {
            console.log(inspect(arg))
        } else {
            console.log(arg)
        }
    };

    showDevTools = () => {
        return this.allow('devtools')
    };

    exposeGlobal = () => {
        return this.allow('expose_global');
    };

    private allow(action: Action) {
        let permissionsStr: string | null = "";
        if (window.localStorage) {
            permissionsStr = window.localStorage.getItem("dev");
        } else {
            if (process.env.NODE_ENV === 'development') {
                permissionsStr = ['console', 'devtools', 'expose_global'].join(',')
            }
        }
        if (permissionsStr) {
            const permissions = permissionsStr.split(',');
            if (permissions.includes(action)) {
                return true;
            }
        }
        return false;
    }
}

export const Dev = new DevDelegate();