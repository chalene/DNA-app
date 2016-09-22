/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBarIOS,
} from 'react-native';

import Login from './view/login';
import Signup from './view/signup';
import Bar from './view/bar';
import Util from './view/utils';

//import varifyUser from  './view/varifyUser';

class DNAapp extends Component {
  constructor() {
    super();
    
    //to check is logined
    // Util.get("http://dnafw.com:8100/iosapp/checkLogin?uid="+AsyncStorage.getItem('uid'),function(resData) {
    //     if (resData){
    //       AsyncStorage.setItem('uid', resData.uid);
    //       AsyncStorage.setItem('isFirstTime',resData.isFirstTime);
    //     }
    // })

    this.state = {
      isLogin: true,//false,
      onSignup: false,
      isFirstTime: "0",
      uid: "",
      page: <View></View>,
    };

  }

  componentWillMount() {
    //StatusBarIOS.setStyle(1);
    this._renderPage();
  }

  _onStateChange = (newState) => {
    //login ,signup or logout
    this.setState(newState);
    this._renderPage();
  }

  _renderPage = () => {
    const _this = this;
    let content = null;
    AsyncStorage.getItem("uid").then((value) => {
      _this.setState({
        uid: value,
      });
      
    //   return AsyncStorage.getItem("isFirstTime");
    // }).then((value) => {
    //   this.setState({
    //     isFirstTime: value
    //   });

      return AsyncStorage.getItem("loginState");
    })
    .then((value) => {
      this.setState({
        isLogin: value=="1"? true:false,
      });
    })
    .done(()=>{
      let lsView = null;
      console.log(this.state);
      if (this.state.isLogin) {

        //在这里加入varifyUser 的验证 然后再显示bar
        content = <Bar
          uid={this.state.uid}
          isFirstTime={this.state.isFirstTime}
          callbackLogout={this._onStateChange.bind(this)}
        />
      } else {
        if (this.state.onSignup) {
          lsView = <Signup
            isLogin={this.state.isLogin}
            onSignin={this.state.onSignin}
            callbackSignup={this._onStateChange.bind(this)}
          />
        } else {
          lsView = <Login
            isLogin={this.state.isLogin}
            onSignin={this.state.onSignin}
            callbackLogin={this._onStateChange.bind(this)}
          />
        }
        content = <View style={styles.container}>
          <Image source={require('./view/img/DNA1.png')} style={styles.bgImageWrapper}/>
          <View>
            <Image style={styles.logo} source={{uri:'dna15'}}></Image>
            <Text style={styles.logoText}>华大DNA</Text>
          </View>
          {lsView}
        </View>
      }  
      //update state in promise
      this.setState({
        page: content,
      });

    });

  }

  render() {
    return this.state.page;
  }
}

const styles = StyleSheet.create({
  container:{
    paddingTop:50,
    alignItems:'center',
    backgroundColor:"#222",
    height: Util.size.height,
    width: Util.size.width
  },
  bgImageWrapper: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    height: Util.size.height,
    width: Util.size.width
  },
  logo:{
    width:70,
    height:70,
    resizeMode: Image.resizeMode.contain,
    marginBottom: 10
  },
  logoText:{
    color: "#fff",
    backgroundColor: "transparent",
    marginBottom:Util.ratio == 2? 40:50,
    fontSize: 16
  },
});

AppRegistry.registerComponent('DNAapp', () => DNAapp);
