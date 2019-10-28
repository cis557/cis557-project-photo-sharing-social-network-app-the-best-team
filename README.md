# CIS557 Project: Photogram

## Instructions

1. Navigate to the project directory.
2. Run command: `npm start`
3. In a web browser, go to `http://localhost:3000`
4. Register an account and log in. You will be redirected to your feed, which is empty for new users. Click on the "user" icon in the top right corner to go to the profile page.
5. On the profile page, use the GUI to upload an image from your computer's file system. You will be redirected back to the feed, where your image will appear. If you upload more images, they will also appear in the feed, in reverse chronological order.

In the future, the GUI for uploading an image will be elsewhere (e.g., on the feed page). For now, though, it resides on the profile page.

Note that users and posts (the two resources we are managing) are stored in a MongoDB Atlas database, so if you restart the server, your account and your uploaded images will persist. At this time, there is no way to delete them through the app.
