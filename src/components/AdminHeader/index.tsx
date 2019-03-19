import React from "react";
import {Container, Dropdown, Icon, Label, Menu} from "semantic-ui-react";
import {observer} from "mobx-react";
import AppServices from "../../services";


const NotificationsTrigger = ({count}: { count: number }) => (<span>
    {count > 0 &&
    <Label color='red' floating size={"tiny"} circular className="top notification-trigger-label">{count}</Label>}
    <Icon name="bell" size={"big"}/>
</span>);

const NotificatonsDropdown = observer(({}) => {

    return (
        <Dropdown trigger={<NotificationsTrigger count={2}/>} icon={null} pointing='top right'>
            <Dropdown.Menu>
                <Dropdown.Item
                    text=""
                />
            </Dropdown.Menu>
        </Dropdown>
    );
});
const UserTrigger = <Icon name="user circle" size={"big"}/>;

export default class AdminHeader extends React.Component<any, {}> {

    render() {
        const isAdmin = true; // #TODO
        return <Menu fixed='top' borderless>
            <Container fluid={true}>
                <Menu.Menu position="left">
                    <Menu.Item
                        name='main'
                        content='Main'
                        onClick={() => AppServices.location.push('/')}
                    />
                    {isAdmin && <Menu.Item
                        name='users'
                        content='Users'
                        onClick={() => AppServices.location.push('/users')}
                    />}
                    {isAdmin && <Menu.Item
                        name='posting'
                        content='Posts'
                        onClick={() => AppServices.location.push('/posting')}
                    />
                    }
                </Menu.Menu>
                <Menu.Menu position="right">
                    <Menu.Item>
                        <NotificatonsDropdown/>
                    </Menu.Item>
                    <Menu.Item>
                        <Dropdown icon={null} trigger={UserTrigger} pointing='top right'>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    icon="user circle"
                                    text="Logout"
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu.Menu>
            </Container>
        </Menu>
    }
}