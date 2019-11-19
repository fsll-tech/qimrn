'use strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Switch,
    Alert, Platform, BackHandler, DeviceEventEmitter, NativeModules,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'
import I18n from "./../i18n/i18N";

const kStarContact = "kStarContact";
const kBlackList = "kBlackList";

export default class UserSetting extends Component{
    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('common_setupButton');
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"UserCard"}/>);
        if (navigation.state.params.innerVC) {
            let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
            leftBtn = (<NavCBtn {...props}/>);
        }
        return {
            headerStyle:{
                borderBottomWidth: 0.5,
                elevation: 0,
                borderColor:'#eaeaea',

            },
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 18,
                flex: 1, textAlign: 'center'
            },
            headerLeft: leftBtn,
            headerRight:<View/>,
        };
    };

    constructor(props) {
        super(props);
        this.userId = this.props.navigation.state.params.userId;
        this.state = {
            starState:false,
            blackState:false,
        }
    }

    componentDidMount() {
        NativeModules.QimRNBModule.isStarOrBlackContact(this.userId,kStarContact,function (response) {
            if(response){
                this.setState({
                    starState:response.ok,
                });
            }
        }.bind(this));

        NativeModules.QimRNBModule.isStarOrBlackContact(this.userId,kBlackList,function (response) {
            if(response){
                this.setState({
                    blackState:response.ok,
                });
            }
        }.bind(this));
    }


    componentWillUnmount() {
    }

    addToStarContacts(value){
        NativeModules.QimRNBModule.setStarOrblackContact(this.userId,kStarContact,value,function (response) {
            if(response.ok){
                DeviceEventEmitter.emit("reloadStarContacts");
            }
        }.bind(this));
    }

    addToBlack(value){
        if(value){
            Alert.alert(I18n.t('Reminder'),I18n.t('blockedUserConfirm'),
                [
                    {text:I18n.t('Cancel'),onPress:() => {
                        this.setState({
                            blackState:false,
                        });
                    }},
                    {text:I18n.t('Ok'),onPress:() =>{
                        NativeModules.QimRNBModule.setStarOrblackContact(this.userId,kBlackList,value,function (response) {
                            if(response.ok){
                                this.setState({blackState: value});
                            }
                        }.bind(this));
                    }}
                ]
            )
        }else {
            NativeModules.QimRNBModule.setStarOrblackContact(this.userId,kBlackList,value,function (response) {

            }.bind(this));
        }
    }

    recommend(){

    }

    render(){
        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    {/*<View style={styles.line}/>*/}
                    {/*<View>*/}
                        {/*<TouchableOpacity style={styles.cellContentView} onPress={this.recommend.bind(this)}>*/}
                            {/*<Text style={styles.cellTitle}>推荐给联系人</Text>*/}
                            {/*<Text style={styles.cellValue}></Text>*/}
                            {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                    <View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>{I18n.t('Starred')}</Text>
                            <View style={styles.cellQRCode}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}} value={this.state.starState}
                                        onValueChange={(value) => {
                                            this.setState({starState: value});
                                            this.addToStarContacts(value);
                                        }}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.line}/>
                    <View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>{I18n.t('Block')}</Text>
                            <View style={styles.cellQRCode}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}} value={this.state.blackState}
                                        onValueChange={(value) => {
                                            if(!value){
                                                this.setState({blackState: value});
                                            }
                                            this.addToBlack(value);
                                        }}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    line: {
        height: 10,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 44,
        borderBottomWidth: 1,
        borderColor: "#eaeaea",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
        flex: 1,
    },
    cellQRCode: {
        flex: 1,
        alignItems: "flex-end",
    },
    cellTitle: {
        width: 100,
        color: "#333333",
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: -7,
    },
});