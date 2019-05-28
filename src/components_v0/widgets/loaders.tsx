import * as React from "react";
import {Loader, LoaderProps} from "semantic-ui-react";
import classnames from 'classnames';
import './widgets.scss'

export const InlineLoader = (props: LoaderProps) => <Loader active inline size={"mini"} {...props} />;

export const CenteredLoader = ({global = false, ...props}: LoaderProps & {global?: boolean}) => {
    const classes = classnames('centered_loader', {global: global});
    return <div style={{width: "100%"}} className={classes}>
        <Loader active inline="centered" size={"medium"} content={"Loading"} {...props} />
    </div>;
};
