import React, {useState} from 'react'
import axios from "axios"
import baseUrl from "../utils/baseUrl"
import { parseCookies } from 'nookies'
import { Segment, Header, Divider, Comment, Grid } from "semantic-ui-react";
import Chat from "../components/Chats/Chat"
import ChatListSearch from '../components/Chats/ChatListSearch';
import { useRouter } from "next/router";
import { NoMessages } from "../components/Layout/NoData";

const Messages = ({chatsData}) => {
    const [chats, setChats] = useState(chatsData);
    const router = useRouter();
    return (
        <>
            <Segment padded basic size="large" style={{marginTop: "5px"}}>
                <Header
                    icon="home"
                    content = "Go Back!"
                    onClick={() => router.push("/")}
                    style={{cursor: "pointer"}}
                />
                <Divider hidden/>
                <div style={{marginBottom: "10px"}}></div>
            </Segment>
        </>
    )
}

Messages.getInitialProps = async(ctx) =>{
    try{
        const {token} = parseCookies(ctx)
        const res = await axios.get(`${baseUrl}/api/chats`, {headers:{Authorization:token}})
        return {chatsData: res.data};
    }catch(error){
        return {errorLoading: true}
    }
}

export default Messages
