import React, {useState} from 'react';
import { Segment, Grid, Image, Divider, Header, Button, List } from 'semantic-ui-react';

const ProfileHeader = ({
    profile, 
    ownAccount, 
    loggedUserFollowStats, 
    setUserFollowStats
}) => {
    const [loading, setLoading]= useState(false);

    //check if we are already following the user or not
    const isFollowing = loggedUserFollowStats.following.length > 0 && 
    loggedUserFollowStats.following.filter(
        following => following.user === profile.user._id
        ).length > 0;
    return (
        <>
            <Segment>
                <Grid stackable>
                    <Grid.Column width={11}>
                        <Grid.Row>
                            <Header 
                                as="h2" 
                                content={profile.user.name} 
                                style={{marginTop: "5px"}}
                            />
                        </Grid.Row>

                        <Grid.Row>
                            {profile.social ? (
                                <>
                                    <List>
                                        <List.Item>
                                            <List.Icon name="mail"/>  
                                            <List.Content content={profile.user.email}/>
                                        </List.Item>

                                        {profile.social.facebook &&(
                                            <List.Item>
                                                <List.Icon name="facebook" color="blue"/>  
                                                <List.Content 
                                                    content={profile.user.facebook}
                                                    style={{color: "blue"}}
                                                />
                                            </List.Item>
                                        ) }

                                        {profile.social.instagram &&(
                                            <List.Item>
                                                <List.Icon name="instagram" color="red"/>  
                                                <List.Content 
                                                    content={profile.user.instagram}
                                                    style={{color: "blue"}}
                                                />
                                            </List.Item>
                                        ) }

                                        {profile.social.youtube &&(
                                            <List.Item>
                                                <List.Icon name="youtube" color="red"/>  
                                                <List.Content 
                                                    content={profile.user.youtube}
                                                    style={{color: "blue"}}
                                                />
                                            </List.Item>
                                        ) }

                                        {profile.social.twitter &&(
                                            <List.Item>
                                                <List.Icon name="twitter" color="blue"/>  
                                                <List.Content 
                                                    content={profile.user.twitter}
                                                    style={{color: "blue"}}
                                                />
                                            </List.Item>
                                        ) }
                                    </List>
                                </>
                            ):(
                                <>No Social Media Link
                                </>
                            )}
                        </Grid.Row>
                    </Grid.Column>

                    <Grid.Column width={5} stretched style={{textAlign: "center"}}>
                        <Grid.Row>
                            <Image src={profile.user.profilePicUrl} avatar size="large"/>
                        </Grid.Row>
                    </Grid.Column>
                    <br/>

                    {!ownAccount && (
                        <Button
                            compact
                            loading={loading}
                            disabled = {loading}
                            content={isFollowing ? "Following" : "Follow"}
                            icon={isFollowing ? "check circle" : "add user"}
                            color={isFollowing ? "instagram" : "twitter"}
                            onClick = { async() =>{
                                setLoading(true);
                                isFollowing
                                    ? await unfollowUser(profile.user._id, setUserFollowStats)
                                    : await followUser(profile.user._id, setUserFollowStats);
                                setLoading(false);
                            }}
                        />
                    )}
                </Grid>
            </Segment>
        </>
    )
}

export default ProfileHeader
