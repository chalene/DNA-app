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

// Configuration file
import { url } from '../config';

/**
 * verifyUser
 * - FaceVarification
 *   - IF null THEN uploadface
 *   - ELSE verification
 * - password again
 */

export default class extends Component{
  // static defaultProps = {
  //     isValid: false,
  //     onFaceSignup: false,
  // };

  static propTypes = {
    uid: React.PropTypes.string.isRequired,
    //isValid: React.PropTypes.bool.isRequired,
    //onFaceSignup: React.PropTypes.bool.isRequired,
    //callbackLogin: React.PropTypes.func.isRequired,
    onFaceSignup: React.PropTypes.bool.isRequired,
    data: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    //this.loginSuccess = this._loginSuccess.bind(this);

    this.state = {
      isValid: this.props.isValid,
      onFaceSignup: this.props.onFaceSignup,
      idFront1Source: {uri:'idfront1'},
      idFront1SourceData: "",
      idFront2Source: {uri:'idfront2'},
      idFront2SourceData: "",
      idFront3Source: {uri:'idfront3'},
      idFront3SourceData: "",
      idFront4Source: {uri:'idfront4'},
      idFront4SourceData: "",
    };
  }

  componentDidMount() {
    //StatusBarIOS.setStyle(1);
  }

  _submitVerify() {
    if(this._saveChangesVerify()){
      //this.closeModal()
      this._loginSuccess()
    }
  }

  _submitSignup() {
    if(this._saveChangesSignup()){
      //this.closeModal()
      this._loginSuccess()
    }
  }

  _loginSuccess() {
    this.props.navigator.push({
              title: "DNA档案列表",
              component:CheckProfile,
              navigationBarHidden: false,
              passProps:{ uid: this.props.uid},
            }); 
  }

  _saveChangesVerify() {
    // return true
    // SSH post: this.refs.form.getValues()
    // const info = this.refs.form.getValues();
    let valid = true;
    // for (var key in info) {
    //   if (info[key]==="") {
    //     valid = false;
    //   }
    // }
    if (!this.state.idFrontSourceData) {
      valid = false;
    }

    if (valid) {
      //this.props.showSpiner(true);
      Util.post(`${url}/check_face/`,{
         // images are sent as jpeg base64
         uid:this.props.uid,
         id_face: this.state.idFrontSourceData,
      }, (resData) => {
          //this.props.showSpiner(false);

          if (resData.error !== "true") {
            if (resData.valid === "false") {
              AlertIOS.alert('提交失败', "对不起 您太帅了系统识别不出来");
              return false
            } else {
              AlertIOS.alert('提交成功', "人脸识别通过 欢迎回来");
              //this.props.navigator.pop();
              this._loginSuccess()
              return true
            }
          } else {
            AlertIOS.alert('服务器无响应', '请稍后再试');
            return false
          }
      })
    }else{
      AlertIOS.alert('提交失败', '请拍摄您的正面照');
    }
  }

  _saveChangesSignup() {
    // return true
    // SSH post: this.refs.form.getValues()
    // const info = this.refs.form.getValues();
    let valid = true;
    // for (var key in info) {
    //   if (info[key]==="") {
    //     valid = false;
    //   }
    // }
    if (!this.state.idFront1SourceData || !this.state.idFront2SourceData || !this.state.idFront3SourceData || !this.state.idFront4SourceData) {
      valid = false;
    }

    if (valid) {
      //this.props.showSpiner(true);
      Util.post(`${url}/upload_face/`,{
        uid:this.props.uid,
        // images are sent as jpeg base64
        id_face_1: this.state.idFront1SourceData,
        id_face_2: this.state.idFront2SourceData,
        id_face_3: this.state.idFront3SourceData,
        id_face_4: this.state.idFront4SourceData,
      }, (resData) => {
          //this.props.showSpiner(false);

          if (resData.error !== "true") {
            if (resData.message === "0") {
              AlertIOS.alert('提交失败', "请检查你所填的资料");
              return false
            } else {
              AlertIOS.alert('提交成功', "请等待审核");
              //this.props.navigator.pop();
              this._loginSuccess()
              return true
            }
          } else {
            AlertIOS.alert('服务器无响应', '请稍后再试');
            return false
          }
      })
    }else{
      AlertIOS.alert('提交失败', '需要拍摄／上传四张照片');
    }
  }

  _uploadFace() {
    const options = {
      title: '选择正面照', 
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', 
      chooseFromLibraryButtonTitle: '从手机相册选取', 
      cameraType: 'front', 
      mediaType: 'photo', 
      allowsEditing: false,
      noData: false, 
      storageOptions: { 
        skipBackup: true, 
        path: 'images'
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const sourceData = 'data:image/jpeg;base64,' + response.data;
        this.setState({
          idFrontSource: source,
          idFrontSourceData: sourceData
        });
        console.log(this.state.idFrontSource)
      }
    });
  }

  _uploadFace1() {
    const options = {
      title: '选择正面照', 
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', 
      chooseFromLibraryButtonTitle: '从手机相册选取', 
      cameraType: 'front', 
      mediaType: 'photo', 
      allowsEditing: false,
      noData: false, 
      storageOptions: { 
        skipBackup: true, 
        path: 'images'
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const sourceData = 'data:image/jpeg;base64,' + response.data;
        this.setState({
          idFront1Source: source,
          idFront1SourceData: sourceData
        });
        console.log(this.state.idFront1Source)
      }
    });
  }

  _uploadFace2() {
    const options = {
      title: '选择正面照(偏右)', 
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', 
      chooseFromLibraryButtonTitle: '从手机相册选取', 
      cameraType: 'front', 
      mediaType: 'photo', 
      allowsEditing: false,
      noData: false, 
      storageOptions: { 
        skipBackup: true, 
        path: 'images'
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const sourceData = 'data:image/jpeg;base64,' + response.data;
        this.setState({
          idFront2Source: source,
          idFront2SourceData: sourceData
        });
        console.log(this.state.idFront2Source)
      }
    });
  }

  _uploadFace3() {
    const options = {
      title: '选择正面照(偏左)', 
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', 
      chooseFromLibraryButtonTitle: '从手机相册选取', 
      cameraType: 'front', 
      mediaType: 'photo', 
      allowsEditing: false,
      noData: false, 
      storageOptions: { 
        skipBackup: true, 
        path: 'images'
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const sourceData = 'data:image/jpeg;base64,' + response.data;
        this.setState({
          idFront3Source: source,
          idFront3SourceData: sourceData
        });
        console.log(this.state.idFront3Source)
      }
    });
  }

  _uploadFace4() {
    const options = {
      title: '选择正面照（偏下）', 
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', 
      chooseFromLibraryButtonTitle: '从手机相册选取', 
      cameraType: 'front', 
      mediaType: 'photo', 
      allowsEditing: false,
      noData: false, 
      storageOptions: { 
        skipBackup: true, 
        path: 'images'
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const sourceData = 'data:image/jpeg;base64,' + response.data;
        this.setState({
          idFront4Source: source,
          idFront4SourceData: sourceData
        });
        console.log(this.state.idFront4Source)
      }
    });
  }
  
  render() {
    let content;
    // Util.post(`${url}/check_face_uploaded/`, {
    //   uid:this.props.uid
    // },(resData) => {
      // if (resData) {
      //   if (resData.exist!=="true") {
          //onFaceSignup false
    if (true){
      if (false) {
          content = <View style={[styles.orderButtonContainer,{paddingBottom:30}]}>
              <TouchableHighlight underlayColor="#eee" style={[styles.btn_if,{backgroundColor:'#ddd'}]} onPress={() => this._uploadFace()}>
              <Text style={{color:'#555'}}>上传正面照</Text>
            </TouchableHighlight>
            <View style={{flex:1,flexDirection:"row"}}>
              <Image source={this.state.idFrontSource} style={[styles.uploadFace,{margin:30}]} />
            </View>
            <TouchableHighlight underlayColor="#48aeb4" style={[styles.btn_if,{backgroundColor:'#1E868C',marginTop:20}]} onPress={() => this._submitSignup()}>
              <Text style={{color:'#fff'}}>提交</Text>
            </TouchableHighlight>
          </View>
        } else {
          content = <View style={[styles.orderButtonContainer,{paddingBottom:30}]}>
            <TouchableHighlight underlayColor="#eee" style={[styles.btn_if,{backgroundColor:'#ddd'}]} onPress={() => this._uploadFace1()}>
              <Text style={{color:'#555'}}>上传正面照－1</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eee" style={[styles.btn_if,{backgroundColor:'#ddd'}]} onPress={() => this._uploadFace2()}>
              <Text style={{color:'#555'}}>上传正面照－2</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eee" style={[styles.btn_if,{backgroundColor:'#ddd'}]} onPress={() => this._uploadFace3()}>
              <Text style={{color:'#555'}}>上传正面照－3</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eee" style={[styles.btn_if,{backgroundColor:'#ddd'}]} onPress={() => this._uploadFace4()}>
              <Text style={{color:'#555'}}>上传正面照－4</Text>
            </TouchableHighlight>
            <View style={{flex:1,flexDirection:"row"}}>
              <Image source={this.state.idFront1Source} style={[styles.uploadFace,{marginRight:30}]} />
              <Image source={this.state.idFront2Source} style={styles.uploadFace} />
            </View>
            <View style={{flex:1,flexDirection:"row"}}>
              <Image source={this.state.idFront3Source} style={[styles.uploadFace,{marginRight:30}]} />
              <Image source={this.state.idFront4Source} style={styles.uploadFace} />
            </View>
            <TouchableHighlight underlayColor="#48aeb4" style={[styles.btn_if,{backgroundColor:'#1E868C',marginTop:20}]} onPress={() => this._submitSignup()}>
              <Text style={{color:'#fff'}}>提交</Text>
            </TouchableHighlight>
          </View>;
        }
      } else {
        content = <View>
          <Text style={{color:'#555'}}></Text>
        </View>;
      }
//    })

    return(
      <ScrollView style={styles.profileListContainer}>
        {content}
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
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
    marginTop: 0, 
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
  btnText:{
    color:"#4285f4",
    fontSize:16,
    paddingTop:10,
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