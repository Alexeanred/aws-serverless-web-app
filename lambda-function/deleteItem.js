// import { DynamoDBClient, DeleteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

// const client = new DynamoDBClient({
//   region: process.env.REGION,
// });

// export const handler = async (event) => {
//   const id = event.queryStringParameters.id;
//   console.log("yd: ", id);
//   if (!/^\d+$/.test(id)) {
//     return {
//       statusCode: 202,
//       headers: {
//         "Access-Control-Allow-Origin": "*", // Required for CORS support to work
//         "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
//       },
//       body: JSON.stringify("Id must be a valid integer."),
//     };
//   }

//   const id_num = parseInt(id, 10);

//   if (!Number.isInteger(id_num) || id_num <= 0) {
//     return {
//       statusCode: 203,
//       headers: {
//         "Access-Control-Allow-Origin": "*", // Required for CORS support to work
//         "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
//       },
//       body: JSON.stringify("Id must be a valid positive integer."),
//     };
//   }

//   const input = {
//     TableName: process.env.TABLE_NAME,
//     Key: {
//       'UserId': { S: id },
//     },
//     ReturnValues: "ALL_OLD",
//     ReturnValuesOnConditionCheckFailure: "ALL_OLD"
//   };

//   let command = new GetItemCommand(input);
  
//   try {
//     const get_response = await client.send(command);
//     console.log("Item response: ", get_response)
//     if (get_response){
//       let command = new DeleteItemCommand(input);
//       const delete_response = await client.send(command);
//       console.log("Item response: ", delete_response)
//       return {
//         statusCode: 200,
//         headers: {
//           "Access-Control-Allow-Origin": "*", // Required for CORS support to work
//           "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
//         },
//         body: JSON.stringify({
//           message: 'Item deleted successfully',
//         }),
//       };
//     } else {
//       return {
//         statusCode: 205,
//         headers: {
//           "Access-Control-Allow-Origin": "*", // Required for CORS support to work
//           "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
//         },
//         body: JSON.stringify("There are no records with this UserId"),
//       };
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log('error: ', error.message);
//     }
//     return {
//       statusCode: 501,
//       body: JSON.stringify(error.message),
//     };
//   }
// };




// REGION --> us-east-2
// TABLE_NAME --> tiennd124-demoDB
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.REGION,
});

export const handler = async (event) => {
  const id = event.queryStringParameters.id;
  console.log("yd: ", id);
  if (!/^\d+$/.test(id)) {
    return {
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({message: "ID must be a valid integer."}),
    };
  }

  const id_num = parseInt(id, 10);

  if (!Number.isInteger(id_num) || id_num <= 0) {
    return {
      statusCode: 203,
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
  const input = {
    TableName: process.env.TABLE_NAME,
    Key: {
      'UserId': { S: id },
    },
    ReturnValues: "ALL_OLD",
    ReturnValuesOnConditionCheckFailure: "ALL_OLD"
  };
  const command = new DeleteItemCommand(input);
  
  try {
    const response = await client.send(command);
    console.log("Item response: ", response)
    if (response.Attributes){
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
          statusCode: 200,
          attributes: response.Attributes,
          message: 'Item deleted successfully'}),
      };
    } else {
      return {
        statusCode: 205,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({message: "There are no records with this UserId"}),
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('error: ', error.message);
    }
    return {
      statusCode: 501,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({message: error.message}),
    };
  }
};