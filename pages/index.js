// import
import React, { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, Auth, API } from "aws-amplify";
import toast from "../components/Toast";
import CustomButton from "../components/Button";
import ShowData from "../components/ShowData";
import Input from "../components/Input";
// Amplify configure
Amplify.configure({
  aws_project_region: "us-east-2",
  aws_cognito_region: "us-east-2",
  aws_user_pools_id: "us-east-2_RDVcouh8Y",
  aws_user_pools_web_client_id: "1hqqdp4ia211pdide83afumv27",
  aws_mandatory_sign_in: "enable",
  aws_cloud_logic_custom: [
    {
      name: "tiennd124-testAPI",
      endpoint: "https://qj29wrd0y1.execute-api.us-east-2.amazonaws.com/v1",
      region: "us-east-2",
    },
  ],
});

export default function Home() {
  const ImageURL =
    "https://d1.awsstatic.com/diagrams/Serverless_Architecture.d930970c77b382db6e0395198aacccd8a27fefb7.png";
  // Take the data from user input
  const [insertFormData, setInsertFormData] = useState({
    id: "",
    name: "",
    age: "",
  });
  const [getFormData, setGetFormData] = useState({
    id: "",
  });
  const [deleteFormData, setDeleteFormData] = useState({
    id: "",
  });
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    name: "",
    age: "",
  });
  // take the status of api Response
  //const [PutapiResponse, setPutApiResponse] = useState(null);
  const [GetapiResponse, setGetApiResponse] = useState(null);
  //const [DeleteapiResponse, setDeleteApiResponse] = useState(null);
  const [UpdateapiResponse, setUpdateApiResponse] = useState(null);
  // handle, take the new input from user
  const handleInsertInputChange = (e) => {
    const { name, value } = e.target;
    setInsertFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleGetInputChange = (e) => {
    const { name, value } = e.target;
    setGetFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleDeleteInputChange = (e) => {
    const { name, value } = e.target;
    setDeleteFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  // Update user data function
  const UpdateUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const idToken = user.signInUserSession.idToken.jwtToken;
      //console.log("idToken: ", idToken);
      const requestHeader = {
        headers: {
          Authorization: idToken,
        },
        queryStringParameters: {
          id: updateFormData.id,
        },
        body: {
          name: updateFormData.name,
          age: updateFormData.age,
        },
      };
      const data = await API.put(
        "tiennd124-testAPI",
        "/dynamodb",
        requestHeader
      );
      //console.log("Data: ", data);
      setUpdateApiResponse(data);
      if (!data.attributes) {
        notify("error", data.message);
      }
      else {
        notify("success", data.message);
      }
    } catch (error) {
      console.error("Error update user data:", error);
    }
  };
  // Delete user data function
  const DeleteUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const idToken = user.signInUserSession.idToken.jwtToken;
      //console.log("idToken: ", idToken);
      const requestHeader = {
        headers: {
          Authorization: idToken,
        },
        queryStringParameters: {
          id: deleteFormData.id,
        },
      };
      const data = await API.del(
        "tiennd124-testAPI",
        "/dynamodb",
        requestHeader
      );
      //console.log("Data: ", data);
      if (data.statusCode === 200) {
        notify(
          "success",
          ` Deleted successfully item with ID ${data.attributes.UserId.S}`
        );
      } else {
        notify("error", data.message);
      }
    } catch (error) {}
  };
  // toast the message
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const dismiss = React.useCallback(() => {
    toast.dismiss();
  }, []);
  // Insert user data function
  const InsertUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const idToken = user.signInUserSession.idToken.jwtToken;
      //console.log("idToken: ", idToken);
      const requestHeader = {
        headers: {
          Authorization: idToken,
        },
        body: {
          id: insertFormData.id,
          name: insertFormData.name,
          age: insertFormData.age,
        },
      };
      const data = await API.post(
        "tiennd124-testAPI",
        "/dynamodb",
        requestHeader
      );
      //console.log("Data: ", data);
      // set condition to show notification
      if (data.statusCode == 200) {
        notify("success", data.body.message);
      } else {
        notify("error", data.body.message);
      }
    } catch (error) {
      console.error("Error inserting user data:", data.body.message);
    }
  };
  // get user data function
  const getUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const idToken = user.signInUserSession.idToken.jwtToken;
      //console.log("idToken: ", idToken);
      const requestHeader = {
        headers: {
          Authorization: idToken,
        },
        queryStringParameters: {
          id: getFormData.id,
        },
      };
      const data = await API.get(
        "tiennd124-testAPI",
        "/dynamodb",
        requestHeader
      );
      setGetApiResponse(data);
      //console.log("Data: ", data);
      if (!data.Item) {
        notify("error", data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>AWS serverless web</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Authenticator loginMechanisms={["email"]} signUpAttributes={["name"]}>
          {({ signOut, user }) => (
            <main className={styles.formcontainer}>
              <h1>Tien Nguyen AWS</h1>
              <h3>Thank you brother Phan Dai Duong for technical support</h3>
              <h3>Thank you brother Hoang Xuan Viet for making the UI beautifully</h3>
              <h2>Web Application Architecture</h2>
              <img src={ImageURL} alt="AWS architecture" />

              <h1>
                Hello {user.attributes.name} - {user.attributes.email}
              </h1>
              <h3></h3>
              <h1>CRUD example</h1>

              <h2>Insert user data</h2>
              <form className={styles.contactform}>
                <Input
                  name={"id"}
                  onChange={handleInsertInputChange}
                  placeholder={"Enter your ID"}
                />
                <Input
                  name={"name"}
                  onChange={handleInsertInputChange}
                  placeholder={"Enter your name"}
                />
                <Input
                  name={"age"}
                  onChange={handleInsertInputChange}
                  placeholder={"Enter your age"}
                />
              </form>
              <br />
              <div>
                {/* Use the CustomButton component */}
                <CustomButton onClick={InsertUserData} content="Insert" />
              </div>

              <br />
              <h2>Get user data by ID</h2>
              <form className={styles.contactform}>
                <Input
                  name={"id"}
                  onChange={handleGetInputChange}
                  placeholder={"Enter your ID"}
                />
              </form>
              <br />
              <div>
                {/* Use the CustomButton component */}
                <CustomButton onClick={getUserData} content="Find" />
              </div>
              {GetapiResponse && (
                <div>
                  {GetapiResponse.Item && (
                    <>
                      <p>Information</p>
                      <ShowData
                        value={GetapiResponse.Item.UserId.S}
                        placeholder="ID"
                      />
                      <ShowData
                        value={GetapiResponse.Item.name.S}
                        placeholder="Name"
                      />
                      <ShowData
                        value={GetapiResponse.Item.age.N}
                        placeholder="Age"
                      />
                    </>
                  )}
                </div>
              )}

              <h2>Update user data by ID</h2>
              <div>
                <form className={styles.contactform}>
                  <Input
                    name={"id"}
                    onChange={handleUpdateInputChange}
                    placeholder={"Enter your ID"}
                  />
                  <Input
                    name={"name"}
                    onChange={handleUpdateInputChange}
                    placeholder={"Enter your name"}
                  />
                  <Input
                    name={"age"}
                    onChange={handleUpdateInputChange}
                    placeholder={"Enter your age"}
                  />
                </form>
                <br />
                <div>
                  {/* Use the CustomButton component */}
                  <CustomButton onClick={UpdateUserData} content="Update" />
                </div>
              </div>
              {UpdateapiResponse && (
                <div>
                  {UpdateapiResponse.attributes && (
                    <>
                      <p>Information</p>
                      <ShowData
                        value={UpdateapiResponse.attributes.UserId.S}
                        placeholder="ID"
                      />
                      <ShowData
                        value={UpdateapiResponse.attributes.name.S}
                        placeholder="Name"
                      />
                      <ShowData
                        value={UpdateapiResponse.attributes.age.N}
                        placeholder="Age"
                      />
                    </>
                  )}
                </div>
              )}
              <br />
              <h2>Delete user data by ID</h2>
              <form className={styles.contactform}>
                <Input
                  name={"id"}
                  onChange={handleDeleteInputChange}
                  placeholder="Enter your ID"
                />
              </form>
              <br />
              <div>
                {/* Use the CustomButton component */}
                <CustomButton onClick={DeleteUserData} content="Delete" />
              </div>
              <br />
              <br />
              <br />
              <div>
                {/* Use the CustomButton component */}
                <CustomButton onClick={signOut} content="Sign out" />
              </div>
            </main>
          )}
        </Authenticator>
      </div>
    </div>
  );
}
