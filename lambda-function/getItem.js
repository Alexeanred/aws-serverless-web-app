// REGION --> us-east-2
// TABLE_NAME --> tiennd124-demoDB
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.REGION
});

export const handler = async (event) => {
  const id = event.queryStringParameters.id;
  console.log("id: ", typeof id);

  if (!/^\d+$/.test(id)) {
    return {
      statusCode: 205,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "ID must be a valid integer." })
    };
  }

  const id_num = parseInt(id, 10);

  if (!Number.isInteger(id_num) || id_num <= 0) {
    return {
      statusCode: 206,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "ID must be a valid positive integer." })
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
  console.log("event: ", event);
  console.log(event.queryStringParameters);

  const input = {
    TableName: process.env.TABLE_NAME,
    Key: {
      'UserId': { S: id },
    }
  };

  const command = new GetItemCommand(input);

  try {
    const response = await client.send(command);
    console.log("Item response: ", response);

    if (response.Item) {
      const result = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(response),
      };
      return result;
    } else {
      return {
        statusCode: 202,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(
          { message: "There are no records for this UserId" })
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('error: ', error.message);
    }
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: error.message })
    };
  }
};
