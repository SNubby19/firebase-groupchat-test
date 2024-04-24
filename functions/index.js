import { https } from "firebase-functions/v1";
import { Timestamp } from "firebase-admin/firestore";
import admin from "firebase-admin";
import { auth, db } from "./firebase.js";
import sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const createGC = https.onCall(async (data, context) => {
  const { emails, chatName, chatID, creatorID, adminIDs } = data;

  const creatorCredentials = await auth.getUser(creatorID);

  const newGCData = {
    createdAt: Timestamp.now(),
    creatorID,
    adminIDs,
    members: [],
    pendingUsers: [],
    chatName,
    chatID,
  };

  const newGCRef = db.collection("groupChats").doc(chatID);

  newGCData.members.push(creatorID);
  const docRef = db.collection("users").doc(creatorID);
  docRef.update({
    groupChats: admin.firestore.FieldValue.arrayUnion(chatID),
  });

  for (const email in emails) {
    if (emails[email] === creatorCredentials.email) {
      console.log("this is the owner, no need to do anything");
      continue;
    }

    auth
      .getUserByEmail(emails[email])
      .then((userRecord) => {
        console.log("adding existing meember");
        newGCData.members.push(userRecord.uid);
        const docRef = db.collection("users").doc(userRecord.uid);
        docRef.update({
          groupChats: admin.firestore.FieldValue.arrayUnion(chatID),
        });
      })
      .catch((error) => {
        const { code } = error;
        switch (code) {
          case "auth/user-not-found":
            const msg = {
              to: emails[email],
              from: "snayak@uwaterloo.ca",
              subject: "Someone has invited you",
              text: `${creatorCredentials.displayName} has invited you to ${chatName}, a free lightweight group
                  chat service for you and your friends at FriendsGC. It looks like you dont have an account
                  with us yet.To start talking to your friends please create an account here: http://192.168.56.1:5173/
                  to use the service. Once you have an account, sign in and click on the "Find Existing Groupchat" button
                  and enter the following code ${chatID}  and click join group chat`,
            };
            sgMail.send(msg);
            console.log("Sending email to non-site-member ", emails[email]);
            break;
          default:
            console.log(error);
            break;
        }
      });
    console.log(newGCData);
    await newGCRef.set(newGCData);
  }

  return { message: "hello" };
}, {
  cors: {
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    headers: ['*'],
    maxAge: 0
  }
});
