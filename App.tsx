import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Clipboard,
} from 'react-native';
import {getUrl, getBody} from './helpers';

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const tofetch = (curlText: string) => {
    //get http
    const regexHttp = /--request [\s\S]*'/g;
    const httpArr: Array<string> | null = curlText.match(regexHttp);
    const url = httpArr && httpArr.length > 0 ? getUrl(httpArr[0]) : '';

    //get body
    const regexBody = /--data-raw '[\s\S]*'/g;
    const bodyArr: Array<string> | null = curlText.match(regexBody);
    const body = bodyArr && bodyArr.length > 0 ? getBody(bodyArr[0]) : '';

    let opt: any = {
      method: url.method,
      headers: url.headers,
    };
    if (url.method == 'POST' && body) {
      opt.body = JSON.stringify(body);
    }
    fetch(url.url, opt)
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        setResult(err);
      });
  };

  const clearAndPaste = async () => {
    setResult('');
    const clip = await Clipboard.getString();
    setText(clip);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Button onPress={() => Keyboard.dismiss()} title="dismiss" />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={() => clearAndPaste()} title="clear and paste" />
            <Button
              onPress={() => {
                setText('');
                setResult('');
              }}
              title="clear"
            />
            <Button
              onPress={() => {
                setResult('');
                tofetch(text);
              }}
              title="send"
            />
          </View>
        </View>
      </View>
      <View style={{flex: 1, borderBottomWidth: 1}}>
        <TextInput
          placeholder="paste curl here"
          multiline
          value={text}
          onChangeText={(text) => setText(text)}
          onSubmitEditing={() => {}}
          style={{height: '100%', width: '100%', padding: 4}}
        />
      </View>
      <View style={{flex: 1, padding: 4}}>
        <Text>Result:</Text>
        <TouchableWithoutFeedback
          accessible={false}
          onPress={() => Keyboard.dismiss()}>
          <Text>{JSON.stringify(result)}</Text>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
