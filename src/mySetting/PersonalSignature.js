import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    Alert,
    StyleSheet,
    TextInput,
    NativeModules,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import I18n from "./../i18n/i18N";

export default class PersonalSignature extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('WhatUp_Setup');
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON}  onPress={() => {
            if (navigation.state.params.onSavePress){
                navigation.state.params.onSavePress();
            }
        }}>{I18n.t('common_saveButton')}</NavCBtn>);
        return {
            headerTitle: headerTitle,

            headerTitleStyle: {
                fontSize: 18,
                flex: 1, textAlign: 'center'
            },
            headerLeft: leftBtn,
            headerRight: rightBtn,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            userId:this.props.navigation.state.params.userId,
            personalSignature:this.props.navigation.state.params.personalSignature,
            oldPersonalSignature:this.props.navigation.state.params.personalSignature,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress:this.onSavePersonalSignature.bind(this),
        });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    onSavePersonalSignature(){
        if (this.state.oldPersonalSignature != this.state.personalSignature || this.state.oldPersonalSignature != this.personalSignature) {
            let parma = {};
            parma["UserId"] = this.state.userId;
            parma["PersonalSignature"] = this.state.personalSignature;
            if (Platform.OS === 'ios') {
                parma["PersonalSignature"] = this.personalSignature;
            }
            NativeModules.QimRNBModule.savePersonalSignature(parma,function (responce) {
                if(responce.ok){
                    DeviceEventEmitter.emit("updatePersonalSignature",parma);
                    this.props.navigation.goBack();
                }else{
                    Alert.alert(I18n.t('Reminder'), I18n.t('faild_change_whatup'));
                }


            }.bind(this));
        } else {
            Alert.alert(I18n.t('Reminder'), I18n.t('No_change_what_up'));
        }
    }

    personalSignatureChangeText(text) {
        if (Platform.OS === 'ios') {
            this.personalSignature = text;
        } else {
            this.setState({personalSignature:text});
        }
    }

    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <Text>{I18n.t('My_Profile_QianMing')}：</Text>
                <TextInput
                    style={styles.textInput}
                    multiline={true}
                    placeholder={I18n.t('input')}
                    defaultValue={this.state.personalSignature}
                    onChangeText={(text) => this.personalSignatureChangeText(text)}
                    underlineColorAndroid='transparent'

                    clearButtonMode="while-editing"
                />
            </ScrollView>
        );
    }
}
var styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    contentContainer: {
        paddingVertical: 15,
        paddingHorizontal:15,
    },
    line: {
        height: 10,
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
    textInput:{
        flex:1,
        height:120,
        backgroundColor:"#FFF",
        marginTop:10,
        marginLeft:-15,
        marginRight:-15,
        paddingLeft:15,
        paddingRight:15,
    }
});