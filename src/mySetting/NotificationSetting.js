import
    React, {
    Component
}
    from
        'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Switch, Alert,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";
import I18n from "./../i18n/i18N";

export default class NotificationSetting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('My_Setting_Notifications');
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
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
            onLinePushState: false,
            notifySoundState: false,
            notifyVibrationState: false,
            startPushState: false,
            notifyPushDetailsState: false,
        };

    }

    componentDidMount() {
        //获取用户在线状态
        NativeModules.QimRNBModule.syncOnLineNotifyState(function (response) {
            let state = response.state;
            this.setState({onLinePushState: state});
        }.bind(this));

        //获取用户通知声音状态
        NativeModules.QimRNBModule.getNotifySoundState(function (response) {
            let state = response.state;
            this.setState({notifySoundState: state});
        }.bind(this));


        //获取用户是否显示通知详情
        NativeModules.QimRNBModule.getNotifyPushDetailsState(function (response) {
            let state = response.state;
            this.setState({notifyPushDetailsState: state});
        }.bind(this));

        //获取消息推送状态
        NativeModules.QimRNBModule.getStartPushState(function (response) {
            let state = response.state;
            this.setState({startPushState: state});
        }.bind(this));

        //获取用户通知震动状态
        NativeModules.QimRNBModule.getNotifyVibrationState(function (response) {
            let state = response.state;
            this.setState({notifyVibrationState: state});
        }.bind(this));
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    //在线也收通知
    changeOnLineNotifyState(onlineState) {
        NativeModules.QimRNBModule.updateOnLineNotifyState(onlineState, function (response) {
                if (response.ok) {

                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('faild_change_notification_online'));
                    this.setState({onLinePushState: !onlineState});
                }
            }.bind(this)
        );
    }

    //更改新消息提示音
    changeNotifySoundState(notifySoundState) {
        NativeModules.QimRNBModule.updateNotifySoundState(notifySoundState, function (response) {
                if (response.ok) {

                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('faild_change_notification_sound'));
                    this.setState({notifySoundState: !notifySoundState});
                }
            }.bind(this)
        );
    }

    //更改新消息震动
    changeNotifyVibrationState(notifyVibrationState) {
        NativeModules.QimRNBModule.updateNotifyVibrationState(notifyVibrationState, function (response) {
                if (response.ok) {

                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('faild_change_notification_vibration'));
                    this.setState({notifyVibrationState: !notifyVibrationState});
                }
            }.bind(this)
        );
    }

    //更改开启消息推送
    changeStartNotifyState(startNotifyState) {
        NativeModules.QimRNBModule.updateStartNotifyState(startNotifyState, function (response) {
                if (response.ok) {

                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('faild_change_turning_notifications'));
                    this.setState({startNotifyState: !startNotifyState});
                }
            }.bind(this)
        );
    }

    //更改消息推送显示详情状态
    changeNotifyPushDetailsState(notifyPushDetailsState) {
        NativeModules.QimRNBModule.updateNotifyPushDetailsState(notifyPushDetailsState, function (response) {
                if (response.ok) {

                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('faild_change_notification_preview'));
                    this.setState({notifyPushDetailsState: !notifyPushDetailsState});
                }
            }.bind(this)
        );
    }

    _renderNotifySetting() {
        return (
            <View>

                <View style={styles.cellContentView}>
                    <Text style={styles.cellTitle}>{I18n.t('My_Setting_NotificationsVibration')}</Text>
                    <View style={styles.cellValue2}>
                        <Switch style={{transform: [{scaleX: .8}, {scaleY: .8}]}}
                                value={this.state.notifyVibrationState}
                                onValueChange={(value) => {
                                    this.setState({notifyVibrationState: value});
                                    this.changeNotifyVibrationState(value);
                                }}/>
                    </View>
                </View>

                <View style={styles.cellContentView}>
                    <Text style={styles.cellTitle}>{I18n.t('My_Setting_NotificationsSwitch')}</Text>
                    <View style={styles.cellValue2}>
                        <Switch style={{transform: [{scaleX: .8}, {scaleY: .8}]}} value={this.state.startPushState}
                                onValueChange={(value) => {
                                    this.setState({startPushState: value});
                                    this.changeStartNotifyState(value);
                                }}/>
                    </View>
                </View>

                <View style={styles.cellContentView}>
                    <Text style={styles.cellTitle}>{I18n.t('My_Setting_NotificationsShowDetail')}</Text>
                    <View style={styles.cellValue2}>
                        <Switch style={{transform: [{scaleX: .8}, {scaleY: .8}]}}
                                value={this.state.notifyPushDetailsState}
                                onValueChange={(value) => {
                                    this.setState({notifyPushDetailsState: value});
                                    this.changeNotifyPushDetailsState(value);
                                }}/>
                    </View>
                </View>

            </View>

        );
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.sectionHeader}>
                        {I18n.t('My_Setting_Notifications')}
                    </Text>

                    <View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>{I18n.t('My_Setting_NotificationsOnline')}</Text>
                            <View style={styles.cellValue2}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: 0.8}]}}
                                        value={this.state.onLinePushState}
                                        onValueChange={(value) => {
                                            this.setState({onLinePushState: value});
                                            this.changeOnLineNotifyState(value);
                                        }}/>
                            </View>
                        </View>

                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>{I18n.t('My_Setting_NotificationsSound')}</Text>
                            <View style={styles.cellValue2}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .8}]}}
                                        value={this.state.notifySoundState}
                                        onValueChange={(value) => {
                                            this.setState({notifySoundState: value});
                                            this.changeNotifySoundState(value);
                                        }}/>
                            </View>
                        </View>

                        {this._renderNotifySetting()}

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
    scrollView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    line: {
        height: 20,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 44,
        borderBottomWidth: 1,
        borderColor: "#eaeaea",
        paddingLeft: 10,
        alignItems: "center",
        flex: 1,
    },
    cellIcon: {
        width: 24,
        height: 24,
        lineHeight: 24,
        fontFamily: "QTalk-QChat",
        fontSize: 22,
        color: "#888888",
        marginRight: 5,
    },
    cellTitle: {
        width: 200,
        color: "#212121",
        fontSize: 14,
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
        marginRight: 5,
    },
    cellValue2: {
        flex: 1,
        alignItems: "flex-end",
        paddingRight: 5,
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    sectionHeader: {
        height: 40,
        lineHeight: 40,
        paddingLeft: 10,
        color: "#616161",
        fontSize: 12,
    },
});