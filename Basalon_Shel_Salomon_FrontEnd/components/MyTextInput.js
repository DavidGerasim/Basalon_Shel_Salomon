import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  UploadingPostInputContainer,
  UploadingPostTextInputStyled,
  UploadingPostInputLabel,
  SignupInputContainer,
  SignupTextInputStyled,
  SignupInputLabel,
} from "./styles";

const MyTextInput = ({ label, icon, ...props }) => {
  return (
    <View>
      <UploadingPostInputLabel>{label}</UploadingPostInputLabel>
      <UploadingPostInputContainer>
        <Ionicons name={icon} size={24} color="#ffffff" />
        <UploadingPostTextInputStyled {...props} />
      </UploadingPostInputContainer>
    </View>
  );
};

export default MyTextInput;
