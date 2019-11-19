'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Image,
    TouchableOpacity, Alert, BackHandler, NativeModules, Platform, DeviceEventEmitter,
} from 'react-native';
import AppConfig from "../common/AppConfig";
import LoadingView from "../common/LoadingView";

export default class SendRedPackNomal extends Component{

    constructor(props) {
        super(props);

        this.xmppid = this.props.navigation.state.params.xmppid;//会话id
        this.isChatRoom = this.props.navigation.state.params.isChatRoom;

        this.state = {
            number : 0,
            credit : 0,
            content : '恭喜发财，大吉大利',
        };
    }

    create_red_envelope() {
        let params = {
            group_id : this.isChatRoom ? this.xmppid : '',
            user_id : this.isChatRoom ? '' : this.xmppid,
            action : 'create_red_envelope',
            number : this.state.number,
            credit : this.state.credit,
            content : this.state.content,
            rtype : 'normal',
        };
        LoadingView.show("开始支付...")
        NativeModules.QimRNBModule.createRedEnvelope(params,function (response) {
            if (response.ok) {
                LoadingView.hidden();
            } else {
                LoadingView.hidden();
                Alert.alert("提示", "红包发送失败");
            }
        }.bind(this));
    }

    closeActivity(){
        let moduleName = "Pay";
        if (Platform.OS === 'ios') {
            AppConfig.exitApp(moduleName);
        } else {
            BackHandler.exitApp();
        }
    }



    render(){
        return (
            <ScrollView style={styles.wrapper}>
                <View style={styles.textLabelTop}>
                    <Text style={{fontSize:12,color:'#A5A5A5'}}>普通红包，每人抢到的红包金额固定</Text>
                </View>

                <View style={styles.textInput1}>
                    <Text style={styles.text}>红包个数</Text>
                    <TextInput
                        style={{flex:1,height:40}}
                        onChangeText={(text) => {this.setState({number:text})}}
                        numberOfLines={1}
                        textAlign="right"
                        placeholder="填写个数"
                        underlineColorAndroid='transparent'
                        clearButtonMode="while-editing"
                        keyboardType='numeric'>
                    </TextInput>
                    <Text style={styles.text}>个</Text>
                </View>
                <View style={styles.textInput1}>
                    <Text style={styles.text}>单个金额</Text>
                    <TextInput
                        style={{flex:1,height:40}}
                        onChangeText={(text) => {this.setState({credit:text})}}
                        numberOfLines={1}
                        textAlign="right"
                        placeholder="填金额数"
                        underlineColorAndroid='transparent'
                        clearButtonMode="while-editing"
                        keyboardType='numeric'>
                    </TextInput>
                    <Text style={styles.text}>元</Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => {this.setState({content:text})}}
                    numberOfLines={4}
                    placeholder="恭喜发财，大吉大利"
                    underlineColorAndroid='transparent'
                    clearButtonMode="while-editing"/>
                <View style={styles.pay}>
                    <TouchableOpacity style={styles.payBtn} onPress={() => {
                        this.create_red_envelope();
                    }}>
                        <Text style={{color: "#FFF", fontSize: 16}}>
                            立即塞钱
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.textLabelBottom}>
                    <Text style={{fontSize:12,color:'#A5A5A5'}}>未领取的红包，将于24小时后发起退款</Text>
                </View>
            </ScrollView>
        );
    }


}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor:'#f5f0f2'
    },
    textLabelTop:{
        marginTop:30,
        marginBottom:10,
        justifyContent: "center",
        alignItems: "center",
    },
    textLabelBottom:{
        marginBottom:20,
        justifyContent: "center",
        alignItems: "center",
    },
    text:{
        fontSize: 16,
        color: "#212121",
        justifyContent: "center",
        alignItems: "center",
    },
    textInput:{
        flex:1,
        height:100,
        paddingLeft:10,
        backgroundColor:"#FFF",
        textAlignVertical:'top',
        marginTop:20,
    },
    textInput1:{
        flex:1,
        flexDirection:'row',
        justifyContent: "center",
        backgroundColor:"#FFF",
        alignItems: "center",
        height:55,
        marginTop:20,
        padding:10
    },
    pay: {
        height: 44,
        paddingLeft: 17,
        paddingRight: 17,
        marginTop: 20,
        marginBottom: 20,
    },
    payBtn: {
        flex: 1,
        backgroundColor: "#e1604c",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
});