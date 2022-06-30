import * as Google from "expo-auth-session/providers/google";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = useState<string>();
  const [userInfo, setUserInfo] = useState<any>();
  const [message, setMessage] = useState<any>();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
    process.env.CLIENT_ID,
    iosClientId:
      process.env.CLIENT_ID,
    expoClientId:
    process.env.CLIENT_ID,
  });

  useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      setAccessToken(response.authentication!.accessToken);
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    userInfoResponse.json().then((data) => {
      setUserInfo(data);
    });
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      {showUserInfo()}
      <Button
        title={accessToken ? "Get User Data" : "Login"}
        onPress={
          accessToken
            ? getUserData
            : () => {
                promptAsync({ useProxy: true, showInRecents: true });
              }
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});
