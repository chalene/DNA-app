'use strict';
import React, { Component } from 'react';
import {
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  NavigatorIOS,
  StatusBarIOS,
  ListView,
  TextInput,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  WebView,
  SliderIOS,
  View
} from 'react-native';

import Util from './utils';
import Icon from 'react-native-vector-icons/FontAwesome';
//import ItemOrder from './itemOrder';

import { url } from '../config';

/**
 * Profile
 * - ProfileList = Orderlist
 * 	-ProfileListItems = ProfileListItems
 *   -ProfileDetail = UpdateDetail
 *     - @type:0 ItemProfile = X html?PDF X or ItemOrder
 *
 */


class ProfileDetail extends Component{
  static propTypes = {
    data: React.PropTypes.object.isRequired,
  };

  render() {
    return(
        <WebView
          automaticallyAdjustContentInsets={true}
          source={{uri: this.props.data.url}}//{{uri: 'http://172.16.68.69:8000/ios/show_dnaprofile_report/?id=19892',}} //
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          startInLoadingState={true}
        />
    );
  }
}

class ProfileListItems extends Component{
  static propTypes = {
    data: React.PropTypes.array.isRequired,
  };

  _renderProfileDetail = (data) => {
    this.props.navigator.push({
      title: "档案详情",
      tintColor:data.bg,
      component:ProfileDetail,
      navigationBarHidden: false,
      passProps:{data:data },
    })
  };

  render() {
    const data = this.props.data;
    const items = data.map((rowData) => {
      return(
        <TouchableHighlight key={rowData.order_number} style={styles.orderListTouch} underlayColor="rgba(0,0,0,0.3)" onPress={()=>this._renderProfileDetail(rowData)}>
          <View style={styles.orderList}>
            <View style={[styles.orderStatus,{backgroundColor:rowData.bg}]}>
              <Text style={{color:"#fff"}}>订单状态：{rowData.status}</Text>
            </View>
            <View style={styles.orderInfo}>
              <Text style={{marginBottom:5}}>订单项目：{rowData.item}</Text>
              <Text style={{marginBottom:5}}>创建日期：{rowData.date}</Text>
              <Text>DNA档案编号：{rowData.send}</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    })
     
    return(
      <View>
        {items}
      </View>
    );
  }
}
    
export default class extends Component{
  static propTypes = {
    uid: React.PropTypes.string.isRequired,
  };

  constructor(props){
    super(props);
    this.state = {
      isRefreshing: false,
      loaded: 0,
      rowData: [],
      refreshTitle: "下拉更新"
    };
  }

  componentWillMount() {
    Util.post(`${url}/show_orders/`, {uid:this.props.uid},(resData) => {
        if (resData.error!=="true") {
          console.log(resData);
          this.setState({
            rowData: resData,
          });
        }
    });
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true,
      refreshTitle: "正在更新"
    });

    Util.post(`${url}/show_orders/`,{uid:this.props.uid},(resData) => {
        if (resData.error!=="true") {
          this.setState({
            isRefreshing: false,
            rowData: resData,
            refreshTitle: "更新完毕",
          });
        }else{
          this.setState({
            isRefreshing: false,
            refreshTitle: "更新失败",
          });
        }
        setTimeout(() => {
          this.setState({
            refreshTitle: "下拉更新"
          });
        }, 1000);
    });
  }

  render() {
    return (
      <ScrollView 
      style={styles.orderListContainer}
      refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            title={this.state.refreshTitle}
            onRefresh={() => this._onRefresh()}
            tintColor="#ddd"
          />
      }>
        <ProfileListItems navigator={this.props.navigator} data={this.state.rowData}></ProfileListItems>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  itemWrapper:{
    backgroundColor: '#eaeaea'
  },
  orderListContainer:{
    position:"relative",
    top: -15
  },
  orderListTouch:{
    marginTop: 15,
    marginBottom: 0,
  },
  orderList:{
    flex:1,
    shadowColor: "#999",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
    borderTopColor: "#bbb",
    borderBottomColor: "#bbb",
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    backgroundColor: "#f7f7f7",
    height: 110
  },
  orderStatus:{
    flex:1,
    height:30,
    paddingTop:6,
    paddingLeft:15,
    paddingBottom:5,
  },
  orderInfo:{
    backgroundColor:"#f7f7f7",
    height: 80,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    shadowColor: "#777",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: -2,
      width: 0
    },
  },
  detialSubtitle:{
    borderLeftWidth: 2,
    paddingLeft:10,
    paddingTop:2,
    paddingBottom:2,
    marginBottom:20,
    justifyContent:'center',
    marginTop:20
  },
  btn_ac:{
    marginTop:13,
    marginBottom:10,
    width:280,
    height:40,
    borderRadius:2,
    justifyContent:'center',
    alignItems:'center',
  },
  detailList:{
    height: Util.size.height-370,
    paddingLeft:20,paddingRight:20,//paddingTop:10,  paddingBottom:20
  },
  detailListEm:{
    fontWeight:"500",
    color: "#333",
    paddingRight:10
  },
  detailListReg:{
    color:"#555",
    paddingBottom:5,
  },
});
