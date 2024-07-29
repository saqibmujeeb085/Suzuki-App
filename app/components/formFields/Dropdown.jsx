import { SelectList } from "react-native-dropdown-select-list";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import { AntDesign } from "@expo/vector-icons";

const Dropdown = ({
  DropItems,
  Data,
  Error,
  save,
  selectedItem,
  Search = false,
  onChange,
}) => {
  const [selected, setSelected] = useState("");
  const [key, setKey] = useState(Date.now()); // Unique key for rerender

  const handleClearSelection = () => {
    setSelected(""); // Clear the selection
    selectedItem(""); // Notify parent component
    setKey(Date.now()); // Force rerender by updating key
  };

  return (
    <View style={styles.dropdownbox}>
      <View style={styles.dropdown}>
        <SelectList
          onChange={onChange}
          key={key}
          dropdownTextStyles={{
            fontSize: mainStyles.h2FontSize,
            fontFamily: mainStyles.appFontRegular,
            color: colors.fontBlack,
          }}
          dropdownItemStyles={{
            borderColor: colors.ligtGreyBg,
            borderBottomWidth: 1,
            marginHorizontal: 20,
            paddingVertical: 20,
            paddingHorizontal: 0,
            marginTop: -8,
            marginBottom: 8,
          }}
          dropdownStyles={{
            backgroundColor: colors.whiteBg,
            padding: 0,
            marginTop: 0,
            borderRadius: 0,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderWidth: 0,
            borderTopWidth: 1,
            borderColor: colors.purple,
            paddingTop: -10,
            maxHeight: 250,
          }}
          inputStyles={{
            color: selected ? colors.fontBlack : colors.fontGrey,
            fontFamily: mainStyles.appFontRegular,
            fontSize: mainStyles.h2FontSize,
          }}
          boxStyles={styles.dealersdropdown}
          placeholder={DropItems}
          setSelected={(val) => {
            setSelected(val);
            selectedItem(val);
          }}
          data={Data}
          save={save}
          search={Search}
          defaultOption={{ key: "", value: DropItems }} // Ensure the placeholder is reset
          value={selected}
        />
        {selected && (
          <AntDesign
            onPress={handleClearSelection}
            style={styles.clearIcon}
            name={"close"}
            color={colors.fontBlack}
            size={20}
          />
        )}
      </View>
      {Error && (
        <AppText
          fontSize={mainStyles.h2FontSize}
          color={colors.fontRed}
          marginLeft={10}
          marginRight={10}
          marginBottom={5}
        >
          {Error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dealersdropdown: {
    backgroundColor: colors.whiteBg,
    paddingVertical: 20,
    borderWidth: 0,
  },
  dropdownbox: {
    gap: 5,
  },
  dropdown: {
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    elevation: 2,
    position: "relative", // Ensure the clear icon is positioned correctly
  },
  clearIcon: {
    backgroundColor: colors.whiteBg,
    position: "absolute",
    padding: 5,
    right: 15,
    top: 15,
  },
});

export default Dropdown;
