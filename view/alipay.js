'use strict';
import React, { Component } from 'react';
import QRCode from 'react-native-qrcode';
import { 
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
  AlertIOS,
  WebView
} from 'react-native';

import Util from './utils';

import { shop_url, url } from '../config';
/**
 * Alipay
 * - Used for Alipay payment
 * - link varies. Refer to the alipay API
 */

export default class extends Component{
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      disabled: true,
      confirmStyle: styles.btn_cm,
      payment_url: url + `/pay_url/order-${props.order_number}/`
    };
  }

  static propTypes = {
    order_number:React.PropTypes.number.isRequired
  }

  componentDidMount() {
    this._prepay();
  }

  _prepay() {
    Util.post(`${url}/pay_url/order-${this.props.order_number}/`,{
      order_number: this.props.order_number,
    },(resData) => {
      if (resData.error !== "true") {
          if (resData.message==="0") {
            AlertIOS.alert('请稍后再试');
          } else {
            let url = resData.url;
            this.setState({
              url: url,
              ready: true
            })
          }
        }else{
          AlertIOS.alert('服务器无响应', '请稍后再试');
        }
    })
  }

  // _pay() {
  //   Util.post(`${url}/pay_order/`,{
  //     order_number: this.props.order_number,
  //   },(resData) => {
  //     if (resData.error !== "true") {
  //         if (resData.message==="0") {
  //           AlertIOS.alert('请稍后再试');
  //         }else{
  //           AlertIOS.alert('支付成功','请前往全部订单查看订单，并刷新订单');
  //           this.props.navigator.popToTop();
  //         }
  //       }else{
  //         AlertIOS.alert('服务器无响应', '请稍后再试');
  //       }
  //   })
  // }

  render() {
    let content;
    if (this.state.ready) {
      content = <QRCode
        style={styles.payment}
        value={this.state.url}
        size={300}
        bgColor='black'
        fgColor='white'/>;
    } else {
      content = <View/>;
    }
    // let jsCode = `
    //   var elem = document.getElementById('J_tip_pc');
    //   elem.children[2].click();
    // `;
    
    return(
      /*
      <WebView
        automaticallyAdjustContentInsets={false}
        source={{uri: this.state.payment_url}}
        style={{marginTop:60}}
        injectedJavaScript={jsCode}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        decelerationRate="normal"
        startInLoadingState={true}
        contentInset={{top: -100, left: -190}}
      />
      */
      <View
        style={styles.container}
        >
        {content}
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
  container:{
    width: Util.size.width,
    height:Util.size.height,
    paddingTop:90,
    alignItems:"center",
  },
  payment:{
    height: 0.7* Util.size.width,
    width: 0.7* Util.size.width,
    marginTop:30,
    marginBottom:30,
    resizeMode: Image.resizeMode.contain
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
})
