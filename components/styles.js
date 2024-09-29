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

export const LoginLine = styled(View)`
  height: 1px;
  width: 100%;
  background-color: #9ca3af;
  margin-vertical: 5px;
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

export const SignUpText = styled(Text)`
  color: #fff;
`;

export const SignupInputLabel = styled(Text)`
  color: #fff;
  font-size: 13px;
  margin-bottom: 5px;
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

export const SignUpLink = styled(Text)`
  color: #8c4e79;
`;

export const SignupButtonText = styled(Text)`
  color: #fff;
  font-size: 16px;
`;

export const ProfileImageContainer = styled(View)`
  align-items: center;
  margin-vertical: 20px;
`;

export const ProfileImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

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

export const SettingsSubTitle = styled(Text)`
  font-size: 18px;
  margin-top: 10px;
  letter-spacing: 1px;
  font-weight: normal;
  color: #bbb;
`;

// Welcome ------------------------------------------------------------------
export const WelcomeInnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 60px;
  background-color: #121212;
`;

export const WelcomeContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const WelcomeImage = styled(Image)`
  width: 100%;
  height: 250px;
  margin-bottom: 20px;
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
  margin-top: 10px;
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

export const WelcomeLine = styled(View)`
  height: 1px;
  width: 100%;
  background-color: #9ca3af;
  margin-vertical: 5px;
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
  margin-top: 10px;
  gap: 60px;
  padding-right: 10px;
`;

export const WelcomeImageContainer = styled(View)`
  position: relative;
  width: 100%;
  height: 250px;
  margin-bottom: 20px;
`;

export const WelcomeSettingsIcon = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
`;

export const WelcomeNotificationIcon = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  right: 60px;
  z-index: 1;
`;

// Uploading Post -----------------------------------------------------------
export const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Row = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

export const AudioPlayer = styled(View)`
  align-items: center;
  margin-vertical: 20px;
`;

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

// הוספת הסגנונות שהיו בקוד הקודם של StyleSheet
export const ModalBackground = styled(View)`
  flex: 1;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled(View)`
  background-color: white;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
`;

export const NumberItem = styled(View)`
  padding: 15px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

export const NumberText = styled(Text)`
  font-size: 20px;
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

// ConfirmReject ---------------------------------------------------------------
export const ConfirmRejectInnerContainer = styled(View)`
  flex: 1;
  justify-content: center; /* ממקם את כל התוכן אנכית במרכז */
  align-items: center; /* ממקם את התוכן אופקית במרכז */
  background-color: #121212;
`;

export const ConfirmRejectContainer = styled(View)`
  width: 90%;
  align-items: center;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 10px;
  justify-content: center; /* מרכז את התוכן בתוך המיכל */
`;

export const ConfirmRejectSubTitle = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  margin-top: 15px;
  text-align: center; /* ממרכז את הטקסט */
`;

export const ConfirmRejectText = styled(Text)`
  font-size: 16px;
  color: #ffffff;
  margin-top: 10px;
  text-align: center; /* ממרכז את הטקסט */
`;

export const ConfirmRejectStyledFormArea = styled(View)`
  width: 100%;
  margin-top: 20px;
  align-items: center; /* ממרכז את התוכן */
`;

export const ConfirmRejectStyledButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: #8c4e79;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  height: 50px;
  width: 120px;
`;

export const ConfirmRejectButtonText = styled(Text)`
  color: #ffffff;
  font-size: 16px;
  text-align: center; /* ממרכז את הטקסט בכפתורים */
`;

export const ConfirmRejectAvatar = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-top: 20px;
`;

export const ConfirmRejectButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  align-items: center; /* ממרכז את הכפתורים */
`;

export const ConfirmRejectSettingsIcon = styled(TouchableOpacity)`
  position: absolute;
  top: 30px;
  left: 20px;
  z-index: 1;
`;

// NotificationIcon -----------------------------------------------------------
export const NotificationInnerContainer = styled(View)`
  flex: 1;
  justify-content: flex-start; /* כדי למנוע דחיפה של האלמנטים למרכז */
  align-items: center;
  margin-top: 0px; /* הסרנו את המרווח כדי שהכותרת תהיה קרובה יותר לחלק העליון */
`;

export const NotificationPageTitle = styled(Text)`
  font-size: 30px;
  color: #ffffff;
  position: absolute;
  align-items: center; /* מיקום הכותרת בגובה החץ */
  top: 17px; /* גובה תואם לחץ */
  max-width: 60%;
`;

export const NotificationStyledFormArea = styled(View)`
  width: 100%;
  margin-top: 80px; /* נשאיר מרווח אחרי הכותרת */
`;

export const NotificationItemContainer = styled(View)`
  background-color: #1e1e1e;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const NotificationText = styled(Text)`
  font-size: 18px;
  color: #ffffff;
`;

export const NotificationLine = styled(View)`
  height: 1px;
  background-color: #ffffff;
  margin: 10px 0;
  opacity: ${({ isFirst }) => (isFirst ? 0.8 : 0.5)};
`;

export const NotificationBackIcon = styled(TouchableOpacity)`
  position: absolute;
  top: 30px;
  left: 10px;
`;

export const NotificationTouchable = styled(TouchableOpacity)`
  width: 100%;
`;

export const NotificationArrowIconContainer = styled(View)`
  justify-content: center;
  align-items: center;
`;

// Map -----------------------------------------------------------------------
export const mapStyles = StyleSheet.create({
  container: {
    flex: 1, // הקונטיינר תופס את כל הגובה והרוחב של המיכל שלו
  },
  map: {
    flex: 1, // המפה תופסת את כל הגובה והרוחב של הקונטיינר שלה
  },
  arrowButton: {
    position: "absolute", // הכפתור ממוקם בצורה מוחלטת ביחס לקונטיינר האב
    top: 90, // המרחק מהחלק העליון של הקונטיינר האב
    left: 15, // המרחק מהצד השמאלי של הקונטיינר האב
    backgroundColor: "rgba(255, 255, 255, 0.5)", // צבע רקע שקוף למחצה להבטחת נראות הכפתור
    padding: 10, // שטח פנימי בכפתור, כדי להגדיל את שטח המגע
    borderRadius: 50, // פינות עגולות לכפתור, כך שהוא ייראה כמו עיגול
  },
  modalContainer: {
    flex: 1, // קונטיינר המודאל תופס את כל הגובה והרוחב של המיכל שלו
    justifyContent: "center", // ממרכז את התוכן בקונטיינר אנכית
    alignItems: "center", // ממרכז את התוכן בקונטיינר אופקית
  },
  modalContent: {
    width: "100%", // רוחב המודאל 90% מהרוחב של הקונטיינר האב
    padding: 20, // שטח פנימי בתוך המודאל
    backgroundColor: "white", // צבע הרקע של המודאל לבן
    borderRadius: 10, // פינות עגולות של המודאל
  },
  modalTitle: {
    fontSize: 20, // גודל הפונט של הכותרת במודאל
    fontWeight: "bold", // עושה את הפונט בולט
  },
  closeButton: {
    marginTop: 20, // רווח מעל הכפתור
    padding: 10, // שטח פנימי בכפתור
    backgroundColor: "#007BFF", // צבע רקע כחול לכפתור
    borderRadius: 5, // פינות עגולות לכפתור
  },
  closeButtonText: {
    color: "white", // צבע הטקסט בכפתור לבן
    textAlign: "center", // מרכז את הטקסט בתוך הכפתור
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
    backgroundColor: "#ffffff", // צבע רקע לבן
    borderColor: "#cccccc", // צבע גבול
    borderWidth: 1, // רוחב גבול
    borderRadius: 5, // פינות מעוגלות
    padding: 10, // רווח פנימי
    marginVertical: 10, // רווח אנכי בין השדות
  },
  sendButton: {
    backgroundColor: "#4CAF50", // צבע הרקע של הכפתור
    padding: 10, // רווח פנימי
    borderRadius: 5, // פינות מעוגלות
    alignItems: "center", // מרכז את התוכן
    marginTop: 10, // רווח מעל הכפתור
  },
  sendButtonText: {
    color: "#ffffff", // צבע הטקסט
    fontWeight: "bold", // משקל הטקסט
  },
});
