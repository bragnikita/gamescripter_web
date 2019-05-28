import React from "react";
import {Container, Menu} from "semantic-ui-react";
import {useRouter} from "react-router5";

export const AdminHeader = () => {
    const router = useRouter();

    return <Menu fixed='top' borderless>
        <Container fluid={true}>
            <Menu.Menu position="left">
                <Menu.Item
                    name='main'
                    content='Main'
                    onClick={() => router.navigate('home')}
                />
                <Menu.Item
                    name='cats'
                    content='Categories'
                    onClick={() => router.navigate('category')}
                />
                <Menu.Item
                    name='cats root'
                    content='Categories root'
                />
            </Menu.Menu>
            <Menu.Menu position="right">
            </Menu.Menu>
        </Container>
    </Menu>
}