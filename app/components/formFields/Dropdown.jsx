import { SelectList } from "react-native-dropdown-select-list";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";

const Dropdown = ({
  DropItems,
  Data,
  Error,
  save,
  selectedItem,
  Search = false,
}) => {
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.dropdownbox}>
      <View style={styles.dropdown}>
        <SelectList
          dropdownTextStyles={{ fontSize: 16, paddingBottom: 10 }}
          dropdownStyles={{
            backgroundColor: "white",
            padding: 0,
            marginTop: -5,
            borderRadius: 0,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderWidth: 0,
            fontSize: 12,
          }}
          boxStyles={styles.dealersdropdown}
          placeholder={DropItems}
          setSelected={(val) => setSelected(val)}
          data={Data}
          save={save}
          search={Search}
          onSelect={() => selectedItem(selected)}
        />
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
    backgroundColor: "white",
    paddingVertical: 20,
    borderWidth: 0,
  },
  dropdownbox: {
    gap: 5,
  },
  dropdown: {
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 2,
  },
});

export default Dropdown;
