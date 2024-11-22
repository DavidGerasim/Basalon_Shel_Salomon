import styled from "styled-components/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

// Login --------------------------------------------------------------------
export const LoginStyledContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: 50px;
  background-color: #121212;
`;

export const LoginInnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 20px;
`;

export const ForgotPasswordText = styled(Text)`
  color: #fff;
  text-align: right;
  margin-bottom: 30px;
`;

export const LoginPageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: #8c4e79;
  padding: 10px;
`;

export const LoginFormArea = styled(View)`
  width: 100%;
`;

export const LoginInputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  border-radius: 25px;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 10px;
  margin-vertical: 10px;
`;

export const LoginTextInputStyled = styled(TextInput)`
  flex: 1;
  padding: 12px;
  padding-left: 10px;
  font-size: 16px;
  color: #1f2937;
`;

export const LoginInputLabel = styled(Text)`
  color: #fff;
  font-size: 13px;
  margin-bottom: 5px;
`;

export const LoginStyledButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: #8c4e79;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  margin-vertical: 5px;
  height: 60px;
`;

export const LoginButtonText = styled(Text)`
  color: #fff;
  font-size: 16px;
`;

export const SocialLoginText = styled(Text)`
  color: #bbb;
  margin-vertical: 10px;
`;

export const SocialLoginContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const SocialIcon = styled(Image)`
  width: 40px;
  height: 40px;
  margin: 0 10px;
`;

export const LoginSignUpLink = styled(Text)`
  color: #8c4e79;
`;

// Signup -------------------------------------------------------------------
export const SignupStyledContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: 50px;
  background-color: #121212;
`;

export const SignupInnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 20px;
`;

export const SignupPageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: #8c4e79;
  padding: 10px;
  margin-top: 80px;
`;

export const SignupFormArea = styled(View)`
  width: 92%;
`;

export const SignupStyledButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: #8c4e79;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  margin-vertical: 5px;
  height: 60px;
`;

export const SignupButtonText = styled(Text)`
  color: #fff;
  font-size: 16px;
`;

export const SignupInputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  border-radius: 25px;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 10px;
  margin-vertical: 10px;
`;

export const SignupTextInputStyled = styled(TextInput)`
  flex: 1;
  padding: 12px;
  padding-left: 10px;
  font-size: 16px;
  color: #1f2937;
`;

export const SignupInputLabel = styled(Text)`
  color: #fff;
  font-size: 13px;
  margin-bottom: 5px;
`;

export const styles = StyleSheet.create({
  errorContainer: {
    position: "absolute",
    top: 350,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  errorText: {
    backgroundColor: "red",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 25,
    top: 100,
  },
});

// Settings -----------------------------------------------------------------
export const SettingsContainer = styled(View)`
  background-color: #1c1c1c;
  flex: 1;
  padding: 25px;
  padding-top: 50px;
  background-color: #121212;
`;

export const SettingsInnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 150px;
  align-items: flex-start;
`;

export const SettingsPageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: #8c4e79;
  padding: 10px;
  color: #ffffff;
`;

export const SettingsAvatar = styled(Image)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;

export const ModalSettingsContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled(View)`
  width: 80%;
  height: 40%;
  background-color: white;
  justify-content: center;
  border-radius: 10px;
  align-items: center;
`;

export const ModalTitle = styled(Text)`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const ModalInput = styled(TextInput)`
  border-width: 1px;
  border-color: #000;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  margin-bottom: 20px;
`;

export const ModalButton = styled(TouchableOpacity)`
  background-color: #007bff;
  padding: 10px;
  border-radius: 5px;
  width: 80%;
  align-items: center;
`;

// Welcome ------------------------------------------------------------------
export const WelcomeInnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 60px;
  background-color: #121212;
`;

export const WelcomeStyledFormArea = styled(View)`
  width: 90%;
`;

export const WelcomePageTitle = styled(Text)`
  font-size: 50px;
  text-align: center;
  margin-top: -180px;
  font-weight: bold;
  color: #8c4e79;
  padding: 10px;
`;

export const WelcomeSubTitle = styled(Text)`
  font-size: 24px;
  margin-top: 10px;
  letter-spacing: 1px;
  font-weight: normal;
  color: #bbb;
`;

export const WelcomeChoosinglTitle = styled(Text)`
  font-size: 18px;
  margin-top: 150px;
  letter-spacing: 1px;
  font-weight: bold;
  color: #bbb;
  margin-left: 10px;
`;

export const WelcomeStyledButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: #8c4e79;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  height: 60px;
  width: 120px;
`;

export const WelcomeButtonText = styled(Text)`
  color: #fff;
  font-size: 24px;
`;

export const WelcomeAvatar = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

export const ButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
  gap: 60px;
  padding-right: 10px;
`;

export const WelcomeImageContainer = styled(View)`
  position: relative;
  width: 100%;
  height: 250px;
  margin-bottom: 20px;
`;

// Uploading Post -----------------------------------------------------------
export const UploadingPostStyledContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: 50px;
  background-color: #121212;
`;

export const UploadingPostInnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 20px;
`;

export const UploadingPostPageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: #8c4e79;
  padding: 10px;
`;

export const UploadingTextInputStyled = styled(TextInput)`
  flex: 1;
  padding: 12px;
  padding-left: 10px;
  font-size: 16px;
  color: #1f2937;
`;

export const UploadingPostFormArea = styled(View)`
  width: 100%;
`;

export const UploadingPostInputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  border-radius: 25px;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 10px;
  margin-vertical: 10px;
`;

export const UploadingPostTextInputStyled = styled.TextInput`
  flex: 1;
  padding: 12px;
  padding-left: 10px;
  font-size: 16px;
  color: #1f2937;
`;

export const UploadingInputLabel = styled(Text)`
  color: #fff;
  font-size: 13px;
  margin-bottom: 5px;
`;

export const UploadingPostInputLabel = styled(Text)`
  color: #fff;
  font-size: 13px;
  margin-bottom: 5px;
`;

export const UploadingPostStyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: #8c4e79;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  margin-vertical: 5px;
  height: 60px;
`;

export const UploadingPostButtonText = styled(Text)`
  color: #fff;
  font-size: 16px;
`;

// Modal styles
export const ModalBackground = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled(View)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

export const ModalText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
`;

// PasswordRestorePage_1 -----------------------------------------------------------
export const PasswordRestorePage_1StyledContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: 50px;
  background-color: #121212;
`;

export const PasswordRestorePage_1InnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 20px;
`;

export const PasswordRestorePage_1PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: #8c4e79;
  margin-top: 150px;
`;

export const PasswordRestorePage_1FormArea = styled(View)`
  width: 92%;
`;

export const PasswordRestorePage_1InputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  border-radius: 25px;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 10px;
  margin-vertical: 10px;
`;

export const PasswordRestorePage_1TextInputStyled = styled(TextInput)`
  flex: 1;
  padding: 12px;
  padding-left: 10px;
  font-size: 16px;
  color: #1f2937;
`;

export const PasswordRestorePage_1InputLabel = styled(Text)`
  color: #fff;
  font-size: 13px;
  margin-bottom: 5px;
`;

export const PasswordRestorePage_1StyledButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: #8c4e79;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  margin-vertical: 5px;
  height: 60px;
`;

export const PasswordRestorePage_1ButtonText = styled(Text)`
  color: #fff;
  font-size: 16px;
`;

// PasswordRestorePage_2 -----------------------------------------------------------
export const PasswordRestorePage_2StyledContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: 50px;
  background-color: #121212;
`;

export const PasswordRestorePage_2InnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 20px;
`;

export const PasswordRestorePage_2PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: #8c4e79;
  padding: 10px;
  margin-top: 100px;
`;

export const PasswordRestorePage_2FormArea = styled(View)`
  width: 92%;
`;

export const PasswordRestorePage_2InputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  border-radius: 25px;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 10px;
  margin-vertical: 10px;
`;

export const PasswordRestorePage_2TextInputStyled = styled(TextInput)`
  flex: 1;
  padding: 12px;
  padding-left: 10px;
  font-size: 16px;
  color: #1f2937;
`;

export const PasswordRestorePage_2InputLabel = styled(Text)`
  color: #fff;
  font-size: 13px;
  margin-bottom: 5px;
`;

export const PasswordRestorePage_2StyledButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: #8c4e79;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  margin-vertical: 5px;
  height: 60px;
`;

export const PasswordRestorePage_2ButtonText = styled(Text)`
  color: #fff;
  font-size: 16px;
`;

// Map -----------------------------------------------------------------------
export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  arrowButton: {
    position: "absolute",
    top: 90,
    left: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 10,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: "black",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

// NotificationIcon -----------------------------------------------------------
export const notificationStyles = StyleSheet.create({
  hostedGigsContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#121212",
  },
  gigCard: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gigText: {
    color: "white",
    fontSize: 16,
  },
  gigTextBold: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  emptyText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  modalCloseButton: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 35,
  },
  pageTitle: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    marginTop: 35,
    width: "20%",
    alignSelf: "center",
  },
  tabIndicator: {
    backgroundColor: "white",
  },
  tabBar: {
    backgroundColor: "#333",
  },
  tabLabel: {
    color: "white",
  },
  tabViewContainer: {
    marginTop: 30,
  },
});

// EditGigPage -----------------------------------------------------------
export const EditGigStyledContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: 50px;
  background-color: #121212;
`;

export const EditGigInnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 20px;
`;

export const EditGigPageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: #8c4e79;
  padding: 10px;
`;

export const EditGigFormArea = styled(View)`
  width: 100%;
`;

export const EditGigInputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  border-radius: 25px;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 10px;
  margin-vertical: 10px;
`;

export const EditGigTextInputStyled = styled(TextInput)`
  flex: 1;
  padding: 12px;
  padding-left: 10px;
  font-size: 16px;
  color: #1f2937;
`;

export const EditGigLabel = styled(Text)`
  color: #fff;
  font-size: 13px;
  margin-bottom: 5px;
`;

export const EditGigSaveButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: #8c4e79;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  margin-vertical: 5px;
  height: 60px;
`;

export const EditGigSaveButtonText = styled(Text)`
  color: #fff;
  font-size: 16px;
`;
