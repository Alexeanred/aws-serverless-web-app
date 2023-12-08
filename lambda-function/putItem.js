// REGION --> us-east-2
// TABLE_NAME --> tiennd124-demoDB
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.REGION
});

export const handler = async (event) => {
  const id = event.id;
  if (!/^\d+$/.test(id)) {
    return {
      statusCode: 405,
      body: {message: "ID must be a valid integer."}
    };
  }

  const id_num = parseInt(id, 10);


  if (!Number.isInteger(id_num) || id_num <= 0) {
    return {
      statusCode: 406,
      body: {message: "ID must be a valid positive integer."}
    };
  }
  if (id_num >= 10000) {
    return {
      statusCode: 407,
      body: {message: "ID must be less than 10000"}
    };
  }  
  // Check if 'age' is a valid integer string
  const ageString = event.age;
  console.log("tuoi: ", ageString)
  if (!/^\d+$/.test(ageString)) {
    return {
      statusCode: 400,
      body: {message: "Age must be a valid integer."}
    };
  }
  // Convert 'age' to a number
  const age = parseInt(ageString, 10);

  // Check if 'age' is a positive integer
  if (!Number.isInteger(age) || age <= 0) {
    return {
      statusCode: 401,
      body: {message: "Age must be a valid positive integer."}
    };
  }
  if (age >= 100) {
    return {
      statusCode: 408,
      body: {message: "Age must be less than 100"}
    };
  }  
  const input = {
    TableName: process.env.TABLE_NAME,
    Item: {
      'UserId': { S:id },
      'name': { S: event.name },
      'age': { N: String(event.age) }
    },
    ConditionExpression: 'attribute_not_exists(UserId)',
  }

  const command = new PutItemCommand(input);

  try {
    const response = await client.send(command);
    console.log('response: ', response);
    return {
      statusCode: 200,
      body: {message: `Successfully insert item ID ${id}`}
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('error: ', error.message);
      return {
        statusCode: 403,
        body: {message: "This UserId already existed. Please input another UserId"}
      };
    }

    return {
      statusCode: 500,
      body: {message: 'Something went wrong'}
    };
  }
};
