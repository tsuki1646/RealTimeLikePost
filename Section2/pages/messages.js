import React, {useState, useRef, useEffect} from 'react'
import io from "socket.io-client"
import axios from "axios"
import baseUrl from "../utils/baseUrl"
import { parseCookies } from 'nookies'
import { useRouter } from "next/router";
import { Segment, Header, Divider, Comment, Grid } from "semantic-ui-react";
import Chat from "../components/Chats/Chat"
import ChatListSearch from '../components/Chats/ChatListSearch';
import { NoMessages } from "../components/Layout/NoData";
import Banner from "../components/Messages/Banner";
import MessageInputField from "../components/Messages/MessageInputField";
import Message from "../components/Messages/Message";
import getUserInfo from "../utils/getUserInfo";
import newMsgSound from "../utils/newMsgSound";
import cookie from "js-cookie";

const Messages = ({chatsData, user}) => {
    const [chats, setChats] = useState(chatsData);
    const router = useRouter();
    const [connectedUsers, setConnectedUsers] = useState([]);
    const socket = useRef();

    const [messages, setMessages] = useState([]);
    const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });

    //This ref is for persiting the state of query string in url throughout re-renders
    //This ref is query string inside url
    const openChatId = useRef("");
    
    //CONNECTION USE EFFECT
    useEffect(()=>{
        if (!socket.current) {
            socket.current = io(baseUrl);
        }

        if(socket.current){
            // socket.current.emit("helloWorld", {name: "Moon", age: "32"});

            // socket.current.on('dataReceived', ({msg})=>{
            //     console.log(msg);
            // });
            socket.current.emit("join", { userId: user._id });

            socket.current.on("connectedUsers", ({ users }) => {
                users.length > 0 && setConnectedUsers(users);
            });

            if (chats.length > 0 && !router.query.message) {
                router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
                shallow: true
                });
            }
        }

        return()=>{
            if (socket.current) {
                socket.current.emit("disconnect");
                socket.current.off();
            }
        };
    }, [])

    //LOAD MESSAGES USE EFFECT
    useEffect(() => {
        const loadMessages = () => {
            socket.current.emit("loadMessages", {
                userId: user._id,
                messagesWith: router.query.message
            });

            socket.current.on("messagesLoaded", async ({ chat }) => {
                setMessages(chat.messages);
                setBannerData({
                name: chat.messagesWith.name,
                profilePicUrl: chat.messagesWith.profilePicUrl
                });

                openChatId.current = chat.messagesWith._id;
                //divRef.current && scrollDivToBottom(divRef);
            });

            // socket.current.on("noChatFound", async () => {
            //     const { name, profilePicUrl } = await getUserInfo(router.query.message);

            //     setBannerData({ name, profilePicUrl });
            //     setMessages([]);

            //     openChatId.current = router.query.message;
            // });
        };

        if (socket.current && router.query.message) loadMessages();
    }, [router.query.message]);

    const sendMsg = msg => {
        if (socket.current) {
            socket.current.emit("sendNewMsg", {
                userId: user._id,
                msgSendToUserId: openChatId.current,
                msg
            });
        }
    };

    //Confirming msg is sent and receiving the messages
    useEffect(()=>{
        if(socket.current){
            socket.current.on('msgSent', ({newMsg})=>{
                if (newMsg.receiver === openChatId.current) {
                    setMessages(prev => [...prev, newMsg]);

                    setChats(prev => {
                        const previousChat = prev.find(chat => chat.messagesWith === newMsg.receiver);
                        previousChat.lastMessage = newMsg.msg;
                        previousChat.date = newMsg.date;

                        return [...prev];
                    });
                }
            })
        }
    }, [])

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
                <div style={{marginBottom: "10px"}}>
                    <ChatListSearch user={user} chats={chats} setChats={setChats}/>
                </div>

                {chats.length > 0 ? (
                <>
                    <Grid stackable>
                    <Grid.Column width={4}>
                        <Comment.Group size="big">
                        <Segment raised style={{ overflow: "auto", maxHeight: "32rem" }}>
                            {chats.map((chat, i) => (
                            <Chat
                                key={i}
                                chat={chat}
                                setChats={setChats}
                                connectedUsers={connectedUsers}
                            />
                            ))}
                        </Segment>
                        </Comment.Group>
                    </Grid.Column>

                    <Grid.Column width={12}>
                        {router.query.message && (
                            <>
                                <div
                                style={{
                                    overflow: "auto",
                                    overflowX: "hidden",
                                    maxHeight: "35rem",
                                    height: "35rem",
                                    backgroundColor: "whitesmoke"
                                }}
                                >
                                    <div style={{ position: "sticky", top: "0" }}>
                                        <Banner bannerData={bannerData} />
                                    </div>

                                    {messages.length > 0 &&
                                    messages.map((message, i) => (
                                        <Message
                                            //divRef={divRef}
                                            key={i}
                                            bannerProfilePic={bannerData.profilePicUrl}
                                            setMessages={setMessages}
                                            message={message}
                                            user={user}
                                            //deleteMsg={deleteMsg}
                                        />
                                    ))}
                                </div>

                                <MessageInputField sendMsg={sendMsg} />                            
                            </>
                        )}
                    </Grid.Column>
                    </Grid>
                </>
                ) : (
                <NoMessages />
                )}
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
