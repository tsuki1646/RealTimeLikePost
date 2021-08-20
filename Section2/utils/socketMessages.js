const messagesLoaded = (setMessages, setBannerData, openChatId)=>{
    setMessages(chat.messages);
    setBannerData({
    name: chat.messagesWith.name,
    profilePicUrl: chat.messagesWith.profilePicUrl
    });

    openChatId.current = chat.messagesWith._id;
    divRef.current && scrollDivToBottom(divRef);
}