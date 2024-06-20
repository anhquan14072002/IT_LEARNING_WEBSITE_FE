import React from "react";
import "primeicons/primeicons.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
import { LoginSocialFacebook } from "reactjs-social-login";

const clientId ="1064675960403-r511aufechb2vs1enui9asqmv5npno05.apps.googleusercontent.com";

const Index = () => {
  const onSuccess = (response) => {
    // const idToken = jwtDecode(response.credential);
    const idToken = response;
    console.log("[Login Success] idToken:", idToken);
    // Handle login success logic here, e.g., save the idToken to state or send it to backend
  };

  const onFailure = (error) => {
    console.log("[Login Failed] error:", error);
    // Handle login failure logic here
  };

  const onResolve = (response) => {
    console.log(response);
  };
  return (
    <> <div className="flex justify-center">
      <GoogleOAuthProvider clientId={clientId}>
        <div className="mr-4">
          <GoogleLogin className="cursor-pointer" onSuccess={onSuccess} onError={onFailure} size={43}/>
        </div>
      </GoogleOAuthProvider>
      <LoginSocialFacebook
        className="cursor-pointer"
        appId="466716385847516"
        onResolve={onResolve}
        onReject={(error) => console.log(error)}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
          alt="Facebook Login"
          style={{ width: "40px", height: "40px" }}
          className="cursor-pointer"
        />
      </LoginSocialFacebook>
      </div>
    </>
  );
};

export default Index;
