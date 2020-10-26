import React, { useRef } from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../../../../config';
import theme from '../../../../styles/theme';
import global from '../../../../styles/global';
import styles from './style';

const SearchBar = ({ onSubmit }) => {
  const textRef = useRef();

  return (
    <View style={global.centeredRow}>
      <GooglePlacesAutocomplete
        ref={textRef}
        placeholder="Search for a place or address"
        onPress={(data) => onSubmit(data.description)}
        query={{ key: GOOGLE_API_KEY, language: 'en' }}
        styles={mergedStyles}
        textInputProps={{
          placeholderTextColor: theme.colors.gray,
          textContentType: 'sublocality',
          clearButtonMode: 'while-editing',
          onSubmitEditing: ({ nativeEvent }) => nativeEvent.text && onSubmit(nativeEvent.text),
        }}
      />
    </View>
  );
};

export default SearchBar;

const mergedStyles = {
  row: styles.row,
  description: styles.description,
  container: styles.container,
  textInputContainer: styles.textInputContainer,
  textInput: styles.searchInput,
  listView: styles.listView,
};
