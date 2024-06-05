import { SelectList } from "react-native-dropdown-select-list";
import { StyleSheet } from "react-native";
import { useState } from "react";

const Dropdown = ({ DropItems, Data, save, selectedItem, Search = false }) => {
  const [selected, setSelected] = useState("");

  return (
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
  );
};

const styles = StyleSheet.create({
  dealersdropdown: {
    backgroundColor: "white",
    borderWidth: 0,
    paddingVertical: 20,
    borderRadius: 5,
  },
});

export default Dropdown;
