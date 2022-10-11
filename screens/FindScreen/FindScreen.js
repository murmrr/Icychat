import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, View } from "react-native";
import AddToChatButton from "../../components/AddToChatButton/AddToChatButton";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import FindBar from "../../components/FindBar/FindBar";
import FindSearchBar from "../../components/FindSearchBar/FindSearchBar";
import ItemDivider from "../../components/ItemDivider/ItemDivider";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor, makeBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { BlurView } from "expo-blur";
import QRCodeModalTile from "../../components/QRCodeModalTile/QRCodeModalTile";
import { BarCodeScanner } from "expo-barcode-scanner";
import QRScannerModalTile from "../../components/QRCodeScannerModalTile/QRCodeScannerModalTile";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";

const FindScreen = ({ forAdd, navigation, route }) => {
  const id = forAdd ? route.params.id : null;
  const chatKey = forAdd ? route.params.chatKey : null;

  const [allUsers, setAllUsers] = useState(null);
  const [query, setQuery] = useState("");
  const [searchBarLoading, setSearchBarLoading] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrScannerModalVisible, setQrScannerModalVisible] = useState(false);

  const context = useContext(MainContext);

  useLayoutEffect(() => {
    if (forAdd) {
      navigation.setOptions({
        headerTitle: "Add",
        headerLeft: (props) => <CustomBackButton navigation={navigation} />,
        headerRight: (props) => (
          <TouchableOpacity
            onPress={() => setQrScannerModalVisible(true)}
            style={{
              paddingHorizontal: 20,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon name="camera" size={20} color={colors.WHITE} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: colors.BLUE,
        },
      });
    } else {
      navigation.setOptions({
        headerLeft: (props) => (
          <TouchableOpacity
            onPress={() => setQrScannerModalVisible(true)}
            style={{
              paddingHorizontal: 20,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon name="camera" size={20} color={colors.WHITE} />
          </TouchableOpacity>
        ),
        headerRight: (props) => (
          <TouchableOpacity
            onPress={() => setQrModalVisible(true)}
            style={{
              paddingHorizontal: 20,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon name="qrcode" size={25} color={colors.WHITE} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: colors.BLUE,
        },
      });
    }
  }, []);

  useInterval(async () => {
    const response = await makeBackendActor(context).getUsers(query);
    setAllUsers(response["ok"]);
    if (searchBarLoading) {
      setSearchBarLoading(false);
    }
  }, POLLING_INTERVAL);

  const renderItem = ({ item }) => (
    <FindBar id={id} chatKey={chatKey} principal={item} forAdd={forAdd} />
  );

  const keyExtractor = (item) => item;

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={qrModalVisible}>
        <BlurView intensity={5} tint="dark" style={styles.modalTileContainer}>
          <QRCodeModalTile setModalVisible={setQrModalVisible} />
        </BlurView>
      </Modal>
      <Modal
        animationType="slide"
        visible={qrScannerModalVisible}
        transparent={true}
      >
        <QRScannerModalTile
          id={id}
          chatKey={chatKey}
          forAdd={forAdd}
          setModalVisible={setQrScannerModalVisible}
        />
      </Modal>
      <View style={styles.container(query == "")}>
        {allUsers ? (
          <FlatList
            ListHeaderComponent={
              <FindSearchBar
                query={query}
                setQuery={setQuery}
                searchBarLoading={searchBarLoading}
                setSearchBarLoading={setSearchBarLoading}
              />
            }
            data={allUsers}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemDivider}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <CustomActivityIndicator />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalTileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: (isEmpty) => ({
    height: "100%",
    backgroundColor: colors.DARK_PRIMARY,
  }),
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FindScreen;
