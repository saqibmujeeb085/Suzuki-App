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
  save,
  selectedItem,
  Search = false,
  onChange,
  defaultOption = { key: "", value: DropItems },
}) => {
  const [selected, setSelected] = useState("");
  const [key, setKey] = useState(Date.now()); // Unique key for rerender

  const handleClearSelection = () => {
    setSelected(""); // Clear the selection
    selectedItem(""); // Notify parent component
    setKey(Date.now()); // Force rerender by updating key
  };
  const placeholder = `Select ${DropItems}`;
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
            borderColor: colors.fontGrey,
            borderBottomWidth: 0.3,
            marginHorizontal: 20,
            paddingVertical: 20,
            paddingHorizontal: 0,
            marginTop: -8,
            marginBottom: 8,
          }}
          dropdownStyles={{
            backgroundColor: "#80808010",
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
          placeholder={""}
          setSelected={(val) => {
            setSelected(val);
            selectedItem(val);
          }}
          data={Data}
          save={save}
          search={Search}
          defaultOption={defaultOption} // Ensure the placeholder is reset
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
        <AppText
          color={colors.fontGrey}
          position={"absolute"}
          top={-6}
          display={selected ? "flex" : "none"}
          left={16}
          fontSize={mainStyles.h3FontSize}
          backgroundColor={colors.ligtGreyBg}
          zIndex={10}
          paddingHorizontal={5}
          paddingVertical={2}
        >
          {DropItems}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dealersdropdown: {
    backgroundColor: "transparent",
    paddingVertical: 20,
    borderWidth: 0,
  },
  dropdownbox: {
    gap: 5,
  },
  dropdown: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.fontGrey,
    // backgroundColor: colors.whiteBg,
    // elevation: 2,
    position: "relative", // Ensure the clear icon is positioned correctly
  },
  clearIcon: {
    backgroundColor: colors.ligtGreyBg,
    position: "absolute",
    padding: 5,
    right: 15,
    top: 15,
  },
});

export default Dropdown;
