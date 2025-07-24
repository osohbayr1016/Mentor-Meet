import { ObjectId } from "mongoose"





  export type StudentType = {
    _id: string,
    email: string,
    password:string,
    phoneNumber?:number,
    firstname:string,
    lastname:string,
    nickname?:string,
    role:string,
    createAt: Date,
    updateAt: Date,
    meetingHistory: ObjectId,
    bookedHistory:ObjectId
  }