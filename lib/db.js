import { MongoClient } from "mongodb";

export default async function () {
  //hmmmz const url = "mongodb://127.0.0.1:27017";
  const url = "mongodb://127.0.0.1:27017";
  console.log('here4')
  return await new MongoClient(url).connect();
}