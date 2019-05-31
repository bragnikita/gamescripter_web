import React from "react";
import {Container, Dropdown, Icon, Menu} from "semantic-ui-react";
import {useRouter} from "react-router5";
import {store} from "../service";

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
                {store().account.user && <Menu.Item>
                    {store().account.user!.username}
                </Menu.Item>
                }
                <Menu.Item>
                    <Dropdown icon={null} trigger={UserTrigger} pointing='top right'>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                icon="settings"
                                text="Profile"
                                onClick={() => store().account.logout()}
                            />
                            <Dropdown.Item
                                icon="sign out"
                                text="Sign out"
                                onClick={() => store().account.logout()}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu.Menu>
        </Container>
    </Menu>
};

const UserTrigger = <Icon name="user circle" size={"big"}/>;