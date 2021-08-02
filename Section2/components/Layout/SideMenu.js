import React from 'react';
import { List, Icon } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from 'next/router';
import {logoutUser} from "../../utils/authUser"

const SideMenu = ({user: {unreadNotification, email, unreadMessage, username}}) => {
    const router = useRouter();
    const isActive = route=>router.pathname===route;
    return (
        <>
            <List style={{ paddingTop: "1rem"}}
                size = "big"
                verticalAlign="middle"
                selection
            >
                <Link href="/">
                    <List.Item active={isActive('/')}>
                        <Icon className="home" size="large" color={isActive('/') && 'teal'}/>
                        <List.Content>
                            <List.Header content="Home" />
                        </List.Content>
                    </List.Item>
                </Link>
                <br />

                <Link href="/messages">
                    <List.Item active={isActive('/messages')}>
                        <Icon 
                            className={unreadMessage ? "hand point right": "mail outline"} 
                            size="large" 
                            color={
                                (isActive('/messages') && 'teal') || (unreadMessage && "orange")
                                }/>
                        <List.Content>
                            <List.Header content="Messages" />
                        </List.Content>
                    </List.Item>
                </Link>
                <br />

                <Link href="/notifications">
                    <List.Item active={isActive('/notifications')}>
                        <Icon 
                            className={unreadNotification ? "hand point right": "bell outline"} 
                            size="large" 
                            color={
                                (isActive('/notifications') && 'teal') || (unreadNotification && "orange")
                                }/>
                        <List.Content>
                            <List.Header content="Notifications" />
                        </List.Content>
                    </List.Item>
                </Link>
                <br />

                <Link href={`/${username}`}>
                    <List.Item active={router.query.username === username}>
                        <Icon className="user" size="large" color={router.query.username === username && 'teal'}/>
                        <List.Content>
                            <List.Header content="Account" />
                        </List.Content>
                    </List.Item>
                </Link>
                <br />

               
                <List.Item onClick={() =>logoutUser(email)}>
                    <Icon className="log out" size="large" />
                    <List.Content>
                        <List.Header content="Logout" />
                    </List.Content>
                </List.Item>
                <br />
                
            </List>
        </>
    );
}

export default SideMenu;
