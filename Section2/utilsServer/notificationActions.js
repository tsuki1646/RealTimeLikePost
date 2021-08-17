const UserModel = require('../models/UserModel')
const NotificationModel = require('../models/NotificationModel')

const setNotificationToUnread = async userId =>{
    try {
        const user = await UserModel.findById(userId);

        if (!user.unreadNotification){
            user.unreadNotification = true;
            await user.save();
        }
    }catch (error){
        console.error(error);
    }
};

const newLikeNotification = async (userId, postId, userToNotifyId) =>{
    try{
        const userToNotify = await Notification.findOne({user: userToNotifyId})

        const newNotification ={
            type: "newLike",
            user: userId,
            post: postId,
            date: Date.now()
        };

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();

        await setNotificationToUnread(userToNotifyId);
        return;

    }catch(error){
        console.error(error);
    }
};

// REMOVE 1

// const removeLikeNotification = async (userId, postId, userToNotifyId) =>{
//     try {
//         const user = await NotificationModel.findOne({user: userToNotifyId});

//         const notificationToRemove = user.notifications.find(
//             notification => notification.type === "newLike" && 
//             notification.post.toString() === postId &&
//             notification.user.toString() === userId
//         );

//         const indexOf = user.notifications
//             .map(notification => notification._id.toString())
//             .indexOf(notificationToRemove._id.toString());

//         await user.notifications.splice(indexOf, 1);
//         await user.save();

//     }catch (error){
//         console.error(error);
//     }
// };

// REMOVE LIKE 2
const removeLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    // Here we are simply using $pull operator to remove the notification from notifications array.
    // Notice we are finding the notification inside Notifications array by adding its type, userId & postId
 
      await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: "newLike",
            user: userId,
            post: postId
          }
        }
      }
    );
 
    return;
  } catch (error) {
    console.error(error);
  }
};

const newCommentNotification = async (postId, commentId, userId, userToNotifyId, text) =>{
    try {
        const userToNotify = await NotificationModel.findOne({user: userToNotifyId});

        const newNotification = {
            type: "newComment",
            user: userId,
            post: postId,
            commentId,
            text,
            date: Date.now()
        };

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId);
        return

    }catch (error){
        console.error(error);
    }
}

// REMOVE COMMENT 1
// const removeCommentNotification = async (postId, commentId, userId, userToNotifyId) =>{
//     try{
//         const user = await NotificationModel.findOne({user: userToNotifyId});

//         const notificationToRemove = await user.notifications.find(
//             notification =>
//                 notification.type === "newComment" &&
//                 notification.user.toString() === userId &&
//                 notification.post.toString() === postId &&
//                 notification.commentId === commentId
//         );

//         const indexOf = await user.notifications
//             .map(notification => notification._id.toString())
//             .indexOf(notificationToRemove._id.toString());

//         await user.notifications.splice(indexOf, 1);
//         await user.save();
            
            
//     }catch(error){
//         console.error(error);
//     }
// };


// REMOVE COMMENT 2
const removeCommentNotification = async (postId, commentId, userId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: "newComment",
            user: userId,
            post: postId,
            commentId: commentId
          }
        }
      }
    );
 
    return;
  } catch (error) {
    console.error(error);
  }
};

const newFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newFollower",
      user: userId,
      date: Date.now()
    };

    await user.notifications.unshift(newNotification);

    await user.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

//REMOVE FOLLOWER 1
// const removeFollowerNotification = async (userId, userToNotifyId) => {
//   try {
//     const user = await NotificationModel.findOne({ user: userToNotifyId });

//     const notificationToRemove = await user.notifications.find(
//       notification =>
//         notification.type === "newFollower" 
//         && notification.user.toString() === userId
//     );

//     const indexOf = await user.notifications
//       .map(notification => notification._id.toString())
//       .indexOf(notificationToRemove._id.toString());

//     await user.notifications.splice(indexOf, 1);

//     await user.save();
//   } catch (error) {
//     console.error(error);
//   }
// };

//REMOVE FOLLOWER 2
const removeFollowerNotification = async (userId, userToNotifyId) => {
  try {
   await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      { $pull: { notifications: { type: "newFollower", user: userId } } }
    );
 
    return;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { 
    newLikeNotification, 
    removeLikeNotification, 
    newCommentNotification,
    removeCommentNotification,
    newFollowerNotification,
    removeFollowerNotification
};