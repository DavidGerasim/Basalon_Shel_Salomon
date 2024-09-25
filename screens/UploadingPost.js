import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Header,
  Row,
  AudioPlayer,
  UploadingPostStyledContainer,
  UploadingPostInnerContainer,
  UploadingPostPageTitle,
  UploadingPostFormArea,
  UploadingPostInputContainer,
  UploadingPostTextInputStyled,
  UploadingPostInputLabel,
  UploadingPostStyledButton,
  UploadingPostButtonText,
} from "./../components/styles";

const UploadingPost = ({ navigation }) => {
  const [beginningTime, setBeginningTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showBeginningPicker, setShowBeginningPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [musicians, setMusicians] = useState(null);
  const [friends, setFriends] = useState(null);
  const [showMusiciansPicker, setShowMusiciansPicker] = useState(false);
  const [showFriendsPicker, setShowFriendsPicker] = useState(false);

  const onChangeBeginningTime = (event, selectedDate) => {
    const currentDate = selectedDate || beginningTime;
    setShowBeginningPicker(Platform.OS === "ios");
    setBeginningTime(currentDate);
  };

  const onChangeEndTime = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setShowEndPicker(Platform.OS === "ios");
    setEndTime(currentDate);
  };

  const handleNumberSelect = (number, type) => {
    if (type === "musicians") {
      setMusicians(number);
      setShowMusiciansPicker(false); // Close the modal
    } else {
      setFriends(number);
      setShowFriendsPicker(false); // Close the modal
    }
  };

  const renderNumberPicker = (type) => {
    return (
      <Modal
        visible={type === "musicians" ? showMusiciansPicker : showFriendsPicker}
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <FlatList
              data={Array.from({ length: 21 }, (_, i) => i)}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.numberItem}
                  onPress={() => handleNumberSelect(item, type)}
                >
                  <Text style={styles.numberText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <UploadingPostStyledContainer style={{ paddingTop: 80 }}>
      <StatusBar style="light" />
      <ScrollView>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              top: 36,
              left: 0,
            }}
          >
            <Ionicons name="arrow-back" size={30} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={{
              position: "absolute",
              top: 38,
              right: 0,
            }}
          >
            <Ionicons name="settings-outline" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <UploadingPostInnerContainer>
          <UploadingPostPageTitle>Post Publication</UploadingPostPageTitle>
          <UploadingPostFormArea>
            <MyTextInput
              label="City"
              placeholder="Enter a full address"
              icon="location-outline"
            />

            {/* Beginning and End Time */}
            <Row style={{ justifyContent: "space-between", marginBottom: -20 }}>
              <Text style={{ color: "#ffffff", marginVertical: 10 }}>
                Beginning Time
              </Text>
              <Text style={{ color: "#ffffff", marginVertical: 10 }}>
                End Time
              </Text>
            </Row>
            <Row style={{ justifyContent: "space-between", marginBottom: 10 }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <TouchableOpacity onPress={() => setShowBeginningPicker(true)}>
                  <MyTextInput
                    placeholder={beginningTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                    icon="time-outline"
                    editable={false}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <MyTextInput
                    placeholder={endTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                    icon="time-outline"
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            </Row>

            {showBeginningPicker && (
              <DateTimePicker
                value={beginningTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onChangeBeginningTime}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onChangeEndTime}
              />
            )}

            <Text style={{ color: "#ffffff", marginVertical: 10 }}>
              The Place Is Available For
            </Text>

            <Row style={{ justifyContent: "space-between", marginBottom: 10 }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <TouchableOpacity onPress={() => setShowMusiciansPicker(true)}>
                  <MyTextInput
                    label="Musicians"
                    placeholder={musicians !== null ? musicians.toString() : ""}
                    icon="musical-notes-outline"
                    placeholderTextColor={
                      musicians !== null ? "#000000" : "#9CA3AF"
                    } // Shows the selected number in black
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setShowFriendsPicker(true)}>
                  <MyTextInput
                    label="Friends"
                    placeholder={friends !== null ? friends.toString() : ""}
                    icon="people-outline"
                    placeholderTextColor={
                      friends !== null ? "#000000" : "#9CA3AF"
                    } // Shows the selected number in black
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            </Row>

            {/* Number Pickers */}
            {renderNumberPicker("musicians")}
            {renderNumberPicker("friends")}

            <MyTextInput
              label="Instruments"
              placeholder="What musical instrument do you have?"
              icon="musical-notes-outline"
            />
            <MyTextInput
              label="Comment"
              placeholder="Comment"
              icon="chatbox-outline"
            />

            <AudioPlayer>
              <Ionicons name="play-circle-outline" size={50} color="#ffffff" />
            </AudioPlayer>
            <UploadingPostStyledButton style={{ backgroundColor: "#34D399" }}>
              <UploadingPostButtonText>Post</UploadingPostButtonText>
            </UploadingPostStyledButton>
          </UploadingPostFormArea>
        </UploadingPostInnerContainer>
      </ScrollView>
    </UploadingPostStyledContainer>
  );
};

const MyTextInput = ({ label, icon, isPassword, ...props }) => {
  return (
    <View>
      <UploadingPostInputLabel>{label}</UploadingPostInputLabel>
      <UploadingPostInputContainer>
        <Ionicons name={icon} size={24} color="#9CA3AF" />
        <UploadingPostTextInputStyled {...props} secureTextEntry={isPassword} />
      </UploadingPostInputContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  numberItem: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  numberText: {
    fontSize: 20,
  },
});

export default UploadingPost;
