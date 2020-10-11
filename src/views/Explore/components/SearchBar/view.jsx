import React, { useState, useRef } from 'react';
import { TextInput } from 'react-native';
import theme from '../../../../styles/theme';
import styles from './style';

const SearchBar = ({ onSubmit }) => {
  const [searchText, setSearchText] = useState('');
  const textRef = useRef();

  return (
    <TextInput
      ref={textRef}
      value={searchText}
      onChangeText={setSearchText}
      onSubmitEditing={({ nativeEvent }) => nativeEvent.text && onSubmit(nativeEvent.text)}
      style={styles.searchInput}
      placeholder="Search for a place or address"
      placeholderTextColor={theme.colors.gray}
      autoCorrect={false}
      textContentType="location"
      clearButtonMode="while-editing"
    />
  );
};

export default SearchBar;
