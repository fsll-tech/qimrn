'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity, Alert, DeviceEventEmitter, BackHandler, Platform,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import SendRedPackLucky from "./SendRedPackLucky";
import SendRedPackNomal from "./SendRedPackNomal";
import AppConfig from "../common/AppConfig";

export default class SendRedPack extends Component{
    static navigationOptions = ({navigation}) => {
        let headerTitle = "发红包";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Pay"}/>);
        if (navigation.state.params.innerVC) {
            let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
            leftBtn = (<NavCBtn {...props}/>);
        }
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
        };
    };

    constructor(props) {
        super(props);

        this.state = {

        };
    }


    componentDidMount() {
        this.paySuccess = DeviceEventEmitter.addListener('paySuccessNotify', function (params) {
            this.closeActivity();
        }.bind(this));
    }


    componentWillUnmount() {
        this.paySuccess.remove();
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
            <View style={styles.wrapper}>

                <ScrollableTabView ref={'tabView'} style={{flex: 1, backgroundColor: 'white'}}
                                   onChangeTab={(obj) => {
                                       this.setState({dismissmode:'on-drag'})

                                   }}
                                   renderTabBar={() => <ScrollableTabBar/>}
                                   tabBarPosition={'top'}
                                   tabBarBackgroundColor={'#fff'}
                                   tabBarActiveTextColor={'#E1604C'}
                                   tabBarInactiveTextColor={'#999999'}
                                   tabBarUnderlineStyle={{backgroundColor: '#E1604C', height: 2}}
                >
                    <SendRedPackLucky {...this.props} tabLabel='拼手气红包'></SendRedPackLucky>
                    <SendRedPackNomal {...this.props} tabLabel='普通红包'></SendRedPackNomal>
                </ScrollableTabView>
            </View>
        );
    }


}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor:'#f5f0f2'
    },

});