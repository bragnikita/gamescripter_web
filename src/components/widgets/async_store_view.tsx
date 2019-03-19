import {observer} from "mobx-react";
import * as React from "react";
import {SimpleResourceStore} from "../../stores/types";
import {CenteredLoader} from "./loaders";

interface AsyncStoreViewProps<T> {
    substore: SimpleResourceStore<T>
    render(data: T):any
    onMount?(): any
}

@observer
export class AsyncStoreView<T> extends React.Component<AsyncStoreViewProps<T>, {}> {
    substore: SimpleResourceStore<T>;
    constructor(props: AsyncStoreViewProps<T>) {
        super(props);
        this.substore = props.substore;
    }

    render() {
        if (this.substore.fetching) {
            return <CenteredLoader/>
        } else {
            return <React.Fragment>{this.props.render(this.substore.resource)}</React.Fragment>;
        }
    }

    componentDidMount(): void {
        if (this.props.onMount) {
            this.props.onMount();
        }
        this.substore.fetch();
    }
}