import * as React from "react";
import {Loader, LoaderProps} from "semantic-ui-react";

export const InlineLoader = (props: LoaderProps) => <Loader active inline size={"mini"} {...props} />;

export const CenteredLoader = (props: LoaderProps) =>
    <div style={{width: "100%"}}>
        <Loader active inline="centered" size={"medium"} content={"Loading"} {...props} />
    </div>;
