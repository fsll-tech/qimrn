/**
 * 红包记录
 **/
'use strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import RedPackMySend from "./RedPackMySend";
import RedPackMyReceive from "./RedPackMyReceive";

export default class RedPackRecod extends Component{
    static navigationOptions = ({navigation}) => {
        let headerTitle = "我的红包";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Pay"}/>);
        if (navigation.state.params.innerVC) {
            let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
            leftBtn = (<NavCBtn {...props}/>);
        }
        // let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON}  onPress={() => {
        //     if (navigation.state.params.onSavePress){
        //         navigation.state.params.onSavePress();
        //     }
        // }}>2019</NavCBtn>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
            // headerRight: rightBtn,
        };
    };

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }


    componentWillUnmount() {
    }

    //show year
    showYearDialog() {

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
                    <RedPackMyReceive {...this.props} tabLabel='我收到的红包'></RedPackMyReceive>
                    <RedPackMySend {...this.props} tabLabel='我发出的红包'></RedPackMySend>
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