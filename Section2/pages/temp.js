import React from 'react'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'

const Index = ({posts}) => {
    return (
        <div>
            {posts && 
            posts.length > 0 && 
            posts.map(post =><h1 key={post.id}>{post.title}</h1>)}
        </div>
    )
}

Index.getInitialProps = async(ctx) =>{
    try{
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
        
        const {name} = ctx.query;
        console.log('Name:' + name);

        return {posts:res.data}
    }catch(error){
        return {errorLoading:true}
    }
}

export default Index
