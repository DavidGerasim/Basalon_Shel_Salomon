import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Pressable,
} from "react-native";
import {
  NotificationInnerContainer,
  NotificationPageTitle,
  NotificationItemContainer,
  NotificationText,
  NotificationStyledFormArea,
  NotificationTouchable,
} from "./../components/styles";

const NotificationIcon = ({
  notifications: initialNotifications,
  navigation,
}) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Function to delete a notification
  const handleDelete = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    setDeleteModalVisible(false);
  };

  // Function to open the modal and set the selected notification
  const openModal = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedNotification(null);
  };

  // Open delete confirmation modal
  const openDeleteModal = (notification) => {
    setSelectedNotification(notification);
    setDeleteModalVisible(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedNotification(null);
  };

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <NotificationInnerContainer style={{ marginTop: 80 }}>
          {/* Back Icon */}
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              position: "absolute",
              left: 10,
              top: 25,
            }}
          >
            <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
          </TouchableOpacity>

          {/* Page Title */}
          <NotificationPageTitle>Notifications</NotificationPageTitle>

          <NotificationStyledFormArea>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <NotificationTouchable
                    onPress={() => openModal(notification)} // פותח את המודל עם הנתונים של ההודעה הנוכחית
                  >
                    <NotificationItemContainer>
                      {/* Displaying the text with the meeting number */}
                      <View style={{ flexDirection: "column", flex: 1 }}>
                        <NotificationText>
                          Meeting number: {index + 1} {/* מספר הרישום */}
                        </NotificationText>
                      </View>

                      {/* Delete Button */}
                      <TouchableOpacity
                        onPress={() => openDeleteModal(notification)} // פותח את מודל האישור למחיקה
                        style={{
                          backgroundColor: "red",
                          paddingVertical: 6, // Smaller button height
                          paddingHorizontal: 12, // Adjust button width
                          borderRadius: 5,
                          marginLeft: 10,
                        }}
                      >
                        <NotificationText
                          style={{ color: "#ffffff", fontSize: 12 }}
                        >
                          DELETE
                        </NotificationText>
                      </TouchableOpacity>
                    </NotificationItemContainer>
                  </NotificationTouchable>
                </React.Fragment>
              ))
            ) : (
              <NotificationText style={{ textAlign: "center" }}>
                Empty meeting list
              </NotificationText>
            )}
          </NotificationStyledFormArea>

          {/* Modal for meeting details */}
          {selectedNotification && (
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={closeModal} // סוגר את המודל
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                    width: "80%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Meeting Details
                  </Text>

                  {/* Details about the meeting */}
                  <Text style={{ marginBottom: 5 }}>
                    Address: {selectedNotification.address}
                  </Text>
                  <Text style={{ marginBottom: 5 }}>
                    Date: {selectedNotification.date}
                  </Text>
                  <Text style={{ marginBottom: 5 }}>
                    Time: {selectedNotification.time}
                  </Text>
                  <Text style={{ marginBottom: 5 }}>
                    Musicians: {selectedNotification.musiciansCount}
                  </Text>
                  <Text style={{ marginBottom: 5 }}>
                    Friends: {selectedNotification.friendsCount}
                  </Text>

                  {/* Close button */}
                  <Pressable onPress={closeModal} style={{ marginTop: 10 }}>
                    <Text style={{ color: "blue" }}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          )}

          {/* Delete confirmation modal */}
          {selectedNotification && (
            <Modal
              visible={deleteModalVisible}
              animationType="fade"
              transparent={true}
              onRequestClose={closeDeleteModal} // סוגר את המודל
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#1e1e1e",
                    padding: 20,
                    borderRadius: 10,
                    width: "80%",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    Are you sure?
                  </Text>

                  {/* YES and NO buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    <Pressable
                      onPress={() => handleDelete(selectedNotification.id)}
                      style={{
                        padding: 10,
                        backgroundColor: "green",
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 5,
                      }}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        YES
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={closeDeleteModal}
                      style={{
                        padding: 10,
                        backgroundColor: "red",
                        borderRadius: 5,
                        flex: 1,
                        marginLeft: 5,
                      }}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        NO
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </NotificationInnerContainer>
      </SafeAreaView>
    </>
  );
};

export default NotificationIcon;
