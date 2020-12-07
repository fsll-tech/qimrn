import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    NativeModules,
    Alert,
    Platform,
    TouchableOpacity,
    BackHandler, DeviceEventEmitter,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import LoadingView from "../common/LoadingView";
import AppConfig from "../common/AppConfig";
import QIMCheckBox from '../common/QIMCheckBox';
import {QIMProgress} from '../common/QIMProgress';
import {QIMLoading} from "../common/QIMLoading";
import I18n from "./../i18n/i18N";

export default class AdviceAndFeedback extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('Feedback');
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"MySetting"}/>);
        return {

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
        this.state = {
            userId: this.props.navigation.state.params.userId,
            chooseLocalLog: true,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.feedBackProgress = DeviceEventEmitter.addListener('updateFeedBackProgress', function (params) {
            this.updateFeedBackProgress(params);
        }.bind(this));
    }

    componentWillUnmount() {
        this.unMount = true;
        // DeviceEventEmitter.removeAllListeners();
    }

    updateFeedBackProgress(params) {
        console.log("上传进度" + params);
        let progress = params["progress"];
        // QIMProgress.updateProgress(progress);
    }

    openDeveloperChat() {
        if (Platform.OS == 'android') {
            let params = {};
            params["NativeName"] = "DeveloperChat";
            NativeModules.QimRNBModule.openNativePage(params);
        } else if (Platform.OS == 'ios') {
            NativeModules.QimRNBModule.openDeveloperChat();
        }

    }

    sendAdviceMsg() {
        if (this.state.adviceText && Platform.OS != 'ios') {
            LoadingView.show(I18n.t('Feedback_Sending'));
            let param = {};
            param["adviceText"] = this.state.adviceText;
            param["logSelected"] = this.state.chooseLocalLog;
            NativeModules.QimRNBModule.sendAdviceMessage(param,function (response) {
                LoadingView.hidden();
                if(response.ok){
                    let moduleName = "MySetting";
                    if (Platform.OS === 'ios') {
                        AppConfig.exitApp(moduleName);
                    } else {
                        BackHandler.exitApp();
                    }
                }　else  {
                    console.log("发送日志失败");
                }
            }.bind(this));
        } else if (this.state.adviceText && Platform.OS == 'ios') {

            let param = {};
            param["adviceText"] = this.state.adviceText;
            param["logSelected"] = this.state.chooseLocalLog;
            NativeModules.QimRNBModule.sendAdviceMessage(param, function (response) {
                if(response.ok){
                    let moduleName = "MySetting";
                    if (Platform.OS === 'ios') {
                        AppConfig.exitApp(moduleName);
                        QIMLoading.hidden();
                    } else {
                        BackHandler.exitApp();
                    }
                }　else  {
                    console.log("发送日志失败");
                }
            }.bind(this));

        } else {
            Alert.alert(I18n.t('Feedback_Reminder'), I18n.t('Feedback_Input_Promt'));
        }
    }

    showChooseLogView() {
        return (
            <View style={styles.checkBox}>
                <QIMCheckBox style={styles.ckBox} size={16} checked={this.state.chooseLocalLog} onValueChange={(value) => {
                    console.log("更改checkBox状态 : "+ value);
                    this.setState({
                        chooseLocalLog:value,
                    });
                }}
                />
                <Text style={styles.uploadLocalLog}>{I18n.t('Feedback_UploadLogs')}</Text>
            </View>
        );
    }

    render() {
        return (

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <View style={styles.cellContentView} >
                    <Text style={{marginLeft:15,marginTop:15,marginRight:15,}}>{I18n.t('Feedback_Method1')}</Text>
                </View>

                <TouchableOpacity style={styles.sendBtn} onPress={() => {
                    this.openDeveloperChat();
                }}>
                    <Text style={styles.sendBtnText}>{I18n.t('Feedback_ContactUs')}</Text>
                </TouchableOpacity>

                <View style={{backgroundColor:'#F5F5F5',flex:1,height:10,marginTop:25}}/>

                <View style={styles.cellContentView}>
                    <Text style={{marginLeft:15,marginTop:15,marginRight:15}}>{I18n.t('Feedback_Method2')}</Text>

                    <TextInput
                        style={styles.textInput}
                        multiline={true}
                        placeholder={I18n.t('Feedback_input')}
                        onChangeText={(text) => this.setState({adviceText: text})}
                        underlineColorAndroid='transparent'
                        clearButtonMode="while-editing"
                        // defaultValue="请简要描述一下问题"
                        textAlignVertical='top'
                    />
                </View>

                {this.showChooseLogView()}

                <TouchableOpacity style={styles.sendBtn} onPress={() => {
                    this.sendAdviceMsg();
                }}>
                    <Text style={styles.sendBtnText}>{I18n.t('Feedback_Send')}</Text>
                </TouchableOpacity>

            </ScrollView>
        );
    }
}
var styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    contentContainer: {
        paddingVertical: 15,
        // paddingHorizontal: 15,
    },
    line: {
        height: 10,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "column",
        padding: 10,
        alignItems: "center",
    },
    textInput: {
        width:300,
        height: 150,
        backgroundColor: "#FFF",
        marginTop: 10,
        marginLeft:10,
        marginRight:10,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    sendBtn: {
        backgroundColor: "#00CABE",
        height: 44,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginLeft:20,
        marginRight:20,
    },
    sendBtnText: {
        fontSize: 16,
        color: "#FFF",
    },
    uploadLocalLog: {
        height: 16,
        lineHeight: 16,
        fontSize: 14,
        color: "#000000",
    },
    developerBtnView: {
        marginTop: 15,
        height: 30,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    developerLabel: {
        height: 30,
        lineHeight: 30,
        fontSize: 16,
        color: "#666666",
    },
    developerBtn: {
        height: 30,
        lineHeight: 30,
        fontSize: 16,
        color: "#41CF94",
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ckBox: {
        marginTop: 15,
        marginLeft:15,
        marginRight: 15,
    },
    checkBox: {
        marginTop: 10,
        marginLeft:25,
        height: 20,
        flexDirection: "row",
        alignItems: "flex-start",
    }
});
