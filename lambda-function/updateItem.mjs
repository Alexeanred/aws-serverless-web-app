// REGION --> us-east-2
// TABLE_NAME --> tiennd124-demoDB
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

const client = new DynamoDBClient({
  region: process.env.REGION
});

export const handler = async (event) => {
   const requestBody = JSON.parse(event.body || '{}');
  const user = {
    userid: {S: event.queryStringParameters.id},
    name: {S:  requestBody.name},
    age: {N: String(requestBody.age)},
  }
  console.log("event: ", JSON.stringify(event, null, 2));
  console.log("user id: ",user.userid);
  console.log("named: ", user.name);
  console.log("aged: ", user.age);
  if (!/^\d+$/.test(user.userid.S)) {
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({message: "ID must be a valid integer."}),
    };
  }
  const id_num = parseInt(user.userid.S, 10);
  if (!Number.isInteger(id_num) || id_num <= 0) {
    return {
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({message: "ID must be a valid positive integer."}),
    };
  }
  if (id_num >= 10000) {
    return {
      statusCode: 207,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({message: "ID must be less than 10000"})
    };
  }
  if (!/^\d+$/.test(user.age.N)) {
    return {
      statusCode: 203,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({message:"Age must be a valid integer."})
    };
  }
  // Convert 'age' to a number
  const age = parseInt(user.age.N, 10);

  // Check if 'age' is a positive integer
  if (!Number.isInteger(age) || age <= 0) {
    return {
      statusCode: 205,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({message:"Age must be a valid positive integer."})
    };
  }  
  if (age >= 100) {
    return {
      statusCode: 209,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({message: "Age must be less than 100"})
    };
  }
  // TODO implement
  const input = {
    TableName: process.env.TABLE_NAME,
    Key: {
      "UserId": user.userid,
      
    },
    ConditionExpression: 'attribute_exists(UserId)',
    "ExpressionAttributeNames": {
      "#N": "name",
      "#A": "age",
    },
    "ExpressionAttributeValues": {
      ":name": user.name,
      ":age": user.age
    },
    "ReturnValues": "ALL_NEW",
    "UpdateExpression": "SET #N = :name, #A = :age"
  }
  const command = new UpdateItemCommand(input);
  try {
    const response = await client.send(command);
    console.log('Item response: ', response);

    // Check if the 'Attributes' property exists in the response
    if (response.Attributes) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          attributes: response.Attributes,
          message: "Successfully updated item"})
        
      };
    } else {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "No attributes updated." })
      };
    }
  }catch (error) {
    if (error instanceof Error) {
      console.log('Item error: ', error.message);
      return {
        statusCode: 208,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({ message: "Please input an existed UserId" })
      };
    }
  }
};
