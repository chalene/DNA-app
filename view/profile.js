'use strict';
import React, { Component } from 'react';
import QRCode from 'react-native-qrcode';
import { 
  AsyncStorage,
  AlertIOS,
  NavigatorIOS,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ListView,
  WebView,
  ScrollView,
  StatusBarIOS,
  Text,
  Image,
  View,
  findNodeHandle
} from 'react-native';

import Util from './utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActivityView from 'react-native-activity-view';
import ImagePickerManager from 'react-native-image-picker';
import { BlurView,VibrancyView } from 'react-native-blur';
import Form from 'react-native-form';
import CheckProfile from './checkProfile'
import VerifyFace from './verifyFace'
import SignupFace from './signupFace'


// Configuration file
import { url } from '../config';

/**
 * verifyUser
 * - FaceVarification
 *   - IF null THEN uploadface
 *   - ELSE verification
 * - password again
 */


class loginAgain extends Component{
  static defaultProps = {
      isLogin: false,
  };

  static propTypes = {
    uid: React.PropTypes.string.isRequired,
    isLogin: React.PropTypes.bool.isRequired,
    //callbackLogin: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    //this.loginSuccess = this._loginSuccess.bind(this);

    this.state = {
      isLogin: this.props.isLogin,
    };
  }

  componentDidMount() {
    //StatusBarIOS.setStyle(1);
  }

  _login(){
    // this.loginSuccess();
    Util.post(`${url}/check_password/`, {
        password: this.refs.form.getValues().password,
        uid:this.props.uid
      }, (resData) => {
        if (resData) {
          if (resData.loginState == "1" ){//"false") {
            //AlertIOS.alert('登陆成功', '成功');   
            this.props.navigator.push({
              title: "DNA档案列表",
              component:CheckProfile,
              navigationBarHidden: false,
              passProps:{ uid: this.props.uid},
            });  
          } else {
            //AsyncStorage.setItem('loginState',"1").done();
            //AsyncStorage.setItem('uid',resData.uid).done();
            AlertIOS.alert('登陆失败', '密码验证不通过'); 
            //this.loginSuccess(resData.uid);
          }
        } else {
          AlertIOS.alert('登陆失败', '服务器无响应');
        }
    })
  }

  // _loginSuccess(uid) {
  //   const newState = {
  //     uid: uid,
  //   }
  //   //this.setState(newState);
  //   //this.props.callbackLogin(newState);
  //   this.props.navigator.push({
  //     title: "DNA档案列表",
  //     component:CheckProfile,
  //     navigationBarHidden: false,
  //     passProps:{ uid: this.props.uid},
  //   })
  // }

  render() {
    return (
      <ScrollView style={styles.profileListContainer}>
        <Form ref="form">
          <View style={styles.inputRow}>
            <TextInput type="TextInput" name="password" ref='SecondInput' placeholderTextColor="#777" style={styles.input} placeholder="密码" password={true}/>
            <Icon name="lock" style={styles.icon} size={20} />
          </View>
        </Form>
        <View style={styles.inputRow}>
          <TouchableHighlight underlayColor="#48aeb4" style={styles.btn_pm} onPress={() => this._login()}>
            <Text style={{color:'#fff'}}>确认</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}




class verifyUser extends Component{
  // static defaultProps = {
  //     //isValid: false,
  //     onFaceSignup: true,
  // };

  static propTypes = {
    uid: React.PropTypes.string.isRequired,
    //onFaceSignup: React.PropTypes.bool.isRequired,
    onFacePress: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onFacePress = this._FaceRequire.bind(this);

    this.state = {
      onFaceSignup: false,//this.props.onFaceSignup,
    };
  }

  componentDidMount() {
    //StatusBarIOS.setStyle(0);
  }

  componentWillMount() {
    // Util.post(`${url}/check_face_uploaded/`, {uid:this.props.uid},(resData) => {
    //   if (resData) {
    //     if (resData.exist === "true") { // Face Login
    //       // this.setState({
    //       //   onFaceSignup: false,
    //       // });
    //       this.onFacePress = this._onFacePress.bind(this);
    //       //AlertIOS.alert('onFaceSignup', onFaceSignup);
    //     }else{ // Face Signup
    //       this.onFacePress = this._onFaceSignupPress.bind(this);
    //       // this.setState({
    //       //   onFaceSignup: true,
    //       // });
    //       // AlertIOS.alert('onFaceSignup', onFaceSignup);
    //     }
    //   } else {
    //       AlertIOS.alert('登陆失败', '服务器无响应');
    //   }
    // });
  }

  _FaceRequire() {
    Util.post(`${url}/check_face_uploaded/`, {uid:this.props.uid},(resData) => {
      if (resData) {
        if (resData.exist === "true") {
          this.props.navigator.push({
            title: "人脸识别登录",
            component:VerifyFace,
            navigationBarHidden: false,
            passProps:{ 
              uid: this.props.uid,
              //onFaceSignup: this.state.onFaceSignup,
            },
          })
          //this.onFacePress = this._onFacePress.bind(this);
          //AlertIOS.alert('onFaceSignup', onFaceSignup);
        } else {
          this.props.navigator.push({
            title: "人脸识别注册",
            component:SignupFace,
            navigationBarHidden: false,
            passProps:{ 
              uid: this.props.uid,
              //onFaceSignup: this.state.onFaceSignup,
            },
          })
          //this.onFacePress = this._onFaceSignupPress.bind(this);
          // this.setState({
          //   onFaceSignup: true,
          // });
          // AlertIOS.alert('onFaceSignup', onFaceSignup);
        }
      } else {
          AlertIOS.alert('登陆失败', '服务器无响应');
      }
    });
  }

  // _onFacePress() {
  //   this.props.navigator.push({
  //     title: "人脸识别登录",
  //     component:VerifyFace,
  //     navigationBarHidden: false,
  //     passProps:{ 
  //       uid: this.props.uid,
  //       //onFaceSignup: this.state.onFaceSignup,
  //     },
  //   })
  // }

  // _onFaceSignupPress() {
  //   this.props.navigator.push({
  //     title: "人脸识别注册",
  //     component:SignupFace,
  //     navigationBarHidden: false,
  //     passProps:{ 
  //       uid: this.props.uid,
  //       //onFaceSignup: this.state.onFaceSignup,
  //     },
  //   })
  // }

  _onPasswordPress() {
    this.props.navigator.push({
      title: "输入密码查看",
      component:loginAgain,
      navigationBarHidden: false,
      passProps:{ uid: this.props.uid},
    })
  }

  _onCheckprofilePress(data) {
    this.props.navigator.push({
      title: "DNA档案列表",
      component:CheckProfile,
      //navigationBarHidden: false,
      passProps:{ uid: this.props.uid},
    })
  }

  render() {
    const {data} = this.props;
    return(
      <ScrollView showsVerticalScrollIndicator={false} style={styles.userContainer}>
        <Image source={require('./img/logo3.png')} style={styles.bgImageWrapper}/>
        <View style={{alignItems:"center",width:Util.size.width}}>
          <TouchableHighlight underlayColor="#FFF5EE" style={styles.big_button} onPress={() => this.onFacePress()}>
            <Text style={{color:'#fff',fontSize: 22,}}>人脸识别</Text>
          </TouchableHighlight>
        </View>
        <View style={{alignItems:"center",width:Util.size.width}}>
          <TouchableHighlight underlayColor="#FFF5EE" style={styles.big_button} onPress={() => this._onPasswordPress()}>
            <Text style={{color:'#fff',fontSize: 22,}}>密码查看</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

export default class extends Component{
  static propTypes = {
    uid: React.PropTypes.string.isRequired,
  };

  componentDidMount() {
    //StatusBarIOS.setStyle(0);
  }

  render() {
    return (
      <NavigatorIOS
        ref='nav'
        style={styles.container}
        initialRoute={{
          title:"DNA档案",
          component: verifyUser,
          passProps:{uid:this.props.uid},
          shadowHidden: true
        }}
        itemWrapperStyle={styles.itemWrapper}
        tintColor="#777"
      />
    );
  }
}

const styles = StyleSheet.create({
  bgImageWrapper: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    height: Util.size.height,
    width: Util.size.width
  },

  big_button:{
    marginTop:0.1*Util.size.width,
    marginBottom:13,
    width:0.5*Util.size.width,
    height:0.4*Util.size.width,//40,
    borderRadius:2,
    backgroundColor:'#1E868C',
    justifyContent:'center',
    alignItems:'center',
  },
  profileListContainer:{
    position:"relative",
    top: 40,
  },
  icon:{
    position: 'absolute',
    right: 10,
    top:9,
    color: '#999',
    backgroundColor: "transparent"
  },
  inputRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    marginBottom:20,
  },
  input:{
    //marginLeft:10,
    //padding:1,
    width:Util.size.width-80,
    borderWidth:Util.pixel,
    height:40,
    paddingLeft:12,
    borderColor:'#eee',
    borderRadius:1,
    color:"#333",
    backgroundColor:"rgba(255, 255, 255, 0.75)"
  },
  container:{
    flex:1,
  },
  itemWrapper:{
    backgroundColor: '#eaeaea'
  },
  userContainer:{
    position:"relative",
    top: 0,
  },
  userMenuContainer:{
    height:45,
    borderTopWidth: Util.pixel,
    borderTopColor:"#bbb",
    borderBottomWidth: Util.pixel,
    borderBottomColor:"#bbb",
    backgroundColor:"#f7f7f7",
    flex:1,
    marginBottom:20,
  },
  userMenu:{
    paddingLeft:50,
    height:45,
    justifyContent:'center',
  },

  itemNavIcon:{
    position:"absolute",
    top:13,
    left:20,
    color: "#454545",
    backgroundColor:"transparent"
  },
  itemNavMenu:{
    position:"absolute",
    top:12,
    right:10,
    color: "#bbb",
    backgroundColor:"transparent"
  },
  orderContainer:{
    alignItems:'center',
    flex:1,
    width: Util.size.width-40,
    marginLeft:20, marginTop: 10
  },
  orderInputContainer:{
    marginTop: 20, 
  },
  orderInputText:{
    fontSize:12
  },
  orderInput:{
    marginTop: 10,
    paddingLeft:10,
    paddingRight: 10,
    paddingTop:5,
    paddingBottom:5,
    width:Util.size.width-80,
    borderWidth:Util.pixel,
    height:40,
    borderColor:'#777',
    borderRadius:2,
    color:"#333",
  },
  orderButtonContainer:{
    marginTop: 20, 
    width: Util.size.width-40,
    marginLeft:20,
    alignItems:"center"
  },
  uploadFace:{
    height:100,
    width:100,
    marginTop:20,
    flex:1,
    borderWidth: 1,
    borderColor: "#aaa"
  },
  uploadId:{
    height:100,
    width:100,
    marginTop:20,
    flex:1,
    borderWidth: 1,
    borderColor: "#aaa"
  },
  btn_pm:{
    marginTop:13,
    width:0.8*Util.size.width,
    height:40,
    borderRadius:2,
    backgroundColor:'#1E868C',
    justifyContent:'center',
    alignItems:'center',
  },
  btn_cm:{
    marginTop:13,
    width:0.8*Util.size.width,
    height:40,
    borderRadius:2,
    backgroundColor:'#BEBEBE',
    justifyContent:'center',
    alignItems:'center',
  },
  btn_if:{
    marginTop:10,
    width:Util.size.width-80,
    height:40,
    borderRadius:2,
    justifyContent:'center',
    alignItems:'center',
  },
  section:{
    backgroundColor: "#f3f3f3",
    paddingLeft:15,
    paddingTop:7,
    paddingBottom:7,
    borderBottomColor:"#ddd",
    borderBottomWidth: Util.pixel
  },
  sectionText:{

  },
  incomeRow:{
    backgroundColor: "#fff",
    height:60,
    borderBottomColor:"#ddd",
    borderBottomWidth: Util.pixel,
    flexDirection:"row",
    paddingLeft:15,
    paddingRight: 15,
    justifyContent:"center"
  },
  incomeRowActive: {
    opacity: 1
  },
  incomeRowNotActive: {
    opacity: 0.45
  },
  incomeRowText:{
    flex:1,
    justifyContent:"center"
  },
  incomeRowIcon:{
    flex:1,
    justifyContent:"center"
  },
  incomeRowOrder:{
    flex:3,
    justifyContent:"center"
  },
  userSettingContainer:{
    marginTop: 100, 
    marginLeft:30,
  },
})
