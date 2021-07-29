import React, { useEffect, useState } from 'react'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'

const Index = ({user, userFollowStats}) => {
    //console.log({user, userFollowStats})
    useEffect(() =>{
        document.title=`Welcome, ${user.name.split("")[0]}`;
    }, [])
    return (
        <div>
            HomePage
        </div>
    )
}



export default Index
