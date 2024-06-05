import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const Search = ({search = true}) => {
  return (
    <View style={styles.searchConatiner}>
    <View style={styles.search}>
     <MaterialCommunityIcons name="magnify" size={20} color={"#BBBBBB"}/>
      <TextInput 
      autoComplete="off"
      placeholderTextColor={"#BBBBBB"}
        style={styles.searchInput}
        placeholder='Search report Here'
      />
      </View>
      {search && <TouchableWithoutFeedback>
     <MaterialCommunityIcons name="arrow-right" size={20} color={"#BBBBBB"}/>
      </TouchableWithoutFeedback>}
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  searchConatiner: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  search: {
    flexDirection: 'row',
    gap: 10,
    width: '80%',
    alignItems: 'center',
  }
})