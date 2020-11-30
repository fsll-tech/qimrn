/* @Flow */
import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
    NativeModules,
    Alert,
    BackHandler,
    Platform,
    FlatList,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";
import ScreenUtils from "../common/ScreenUtils";
import I18n from "./../i18n/i18N";

export default class UserCard extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('singlechat_Personal_Information');
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"UserCard"}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>{I18n.t('common_setupButton')}</NavCBtn>);
        if (navigation.state.params.innerVC) {
            let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
            leftBtn = (<NavCBtn {...props}/>);
        }
        return {
            headerTitle: headerTitle,

            headerTitleStyle: {
                fontSize: 18,
                flex: 1, textAlign: 'center'
            },
            headerStyle:{
                borderBottomWidth: 0.5,
                elevation: 0,
                borderColor:'#eaeaea',

            },

            headerLeft: leftBtn,
            headerRight: rightBtn,
        };
    };

    constructor(props) {
        super(props);

        let showOrganizational = AppConfig.getShowOrganizational();
        let showWorkWorld = AppConfig.isShowWorkWorld();
        this.state = {
            userId: this.props.navigation.state.params.UserId,
            userInfo: {},
            userMood: null,
            userLead: null,
            medalList: [],
            isFriend: false,
            userMedal: null,
            showLeader: showOrganizational === 1 ? false : true,
            isShowWrokWorldB: showWorkWorld,

        };
        this.unMount = false;
    }


    componentDidMount() {

        this.props.navigation.setParams({
            onSavePress: this.setting.bind(this),
        });

        //由于展示的数据需要从3个接口过来,所以拆分成3个接口的数据展示

        try {

            this.loadSource();
            this.subscription = DeviceEventEmitter.addListener('updateRemark', function (params) {
                this.updateRemark(params);
            }.bind(this));

            this.refreshNick = DeviceEventEmitter.addListener('updateNick', function (params) {
                this.updateNick(params);
            }.bind(this));

            this.refreshLeader = DeviceEventEmitter.addListener('updateLeader', function (params) {
                this.updateLeader(params);
            }.bind(this));

            this.refreshUserMedal = DeviceEventEmitter.addListener('updateMedal', function (params) {
                this.updateMedal(params);
            }.bind(this));
            // this.updateMedalList = DeviceEventEmitter.addListener('updateMedalList', function (params) {
            //     this.updateMedalListView(params);
            // }.bind(this));

        } catch (e) {

        }
    }


    updateMedalListView(params) {
        let userId = params.UserId;
        if (this.state.userId == userId) {
            let medalList = params.medalList;
            this.setState({medalList: params.medalList});
        }
    }

    _getMedalListView() {
        if (this.state.medalList == null) {
            return null;
        }
        let list = [];
        for (let i = 0; i < this.state.medalList.length; i++) {
            list.push(
                <Image source={{uri: this.state.medalList[i]}} style={styles.medalListItem}/>
            )
        }
        return list;
    }

    setting() {
        this.props.navigation.navigate('UserSetting', {
            'innerVC': true,
            'userId': this.state.userId,
        });

    }

    updateNick(params) {
        let info = params.UserInfo;
        let userId = params.UserId;
        if (this.state.userId == userId) {

            this.setState({userInfo: info});
            this.setState({userMood: info});
        }
        // this.props.navigation.setParams({
        //     title: info["Name"],
        // });
    }

    updateLeader(params) {
        let userId = params.UserId;
        if (this.state.userId == userId) {
            let info = params.LeaderInfo;
            this.setState({userLead: info});
        }
    }

    updateMedal(params) {
        let userId = params.UserId;
        if (this.state.userId == userId) {
            let userMedals = params.UserMedals;
            this.setState({userMedal: userMedals});
        }
    }

    loadSource() {
        // NativeModules.QimRNBModule.getUserInfo(this.state.userId, function (responce) {
        //     this.setState({userInfo: responce.UserInfo});
        //     this.props.navigation.setParams({
        //         title: responce.UserInfo["Name"],
        //     });
        // }.bind(this));

        NativeModules.QimRNBModule.getUserInfoByUserCard(this.state.userId, function (responce) {
            this.setState({userInfo: responce.UserInfo});
            this.props.navigation.setParams({
                title: responce.UserInfo["Name"],
            });
            this.setState({medalList: responce.medalList});
        }.bind(this));
        // NativeModules.QimRNBModule.getUserInfoByUserCard(this.state.userId,
        //     function (responce) {
        //         this.setState({userInfo: responce.UserInfo});
        //         this.props.navigation.setParams({
        //             title: responce.UserInfo["Name"],
        //         });
        //     }.bind(this));

        NativeModules.QimRNBModule.getUserMood(this.state.userId, function (responce) {
            if (responce) {
                this.setState({userMood: responce.UserInfo});
            }

        }.bind(this));
        NativeModules.QimRNBModule.getUserLead(this.state.userId, function (responce) {
            this.setState({userLead: responce.UserInfo});

        }.bind(this));

        NativeModules.QimRNBModule.getFriend(this.state.userId, function (response) {
            let state = response.FriendBOOL;
            // console.log("isFriendState + ", response);
            this.setState({isFriend: state});
        }.bind(this));

        try {
            //获取用户勋章列表方法
            NativeModules.QimRNBModule.getUserMedal(this.state.userId, function (response) {
                this.setState({userMedal: response.UserMedal});
            }.bind(this));
        } catch (e) {
            console.log("调用Native获取用户勋章列表方法失败" + e);
        }
    }

    componentWillUnmount() {
        this.unMount = true;
        if (this.subscription) {
            this.subscription.remove();
        }
        if (this.refreshNick) {
            this.refreshNick.remove();
        }
        if (this.refreshUserMedal) {
            this.refreshUserMedal.remove();
        }
        if (this.refreshLeader) {
            this.refreshLeader.remove();
        }

        // if( this.updateMedalList){
        //     this.updateMedalList.remove();
        // }
    }

    updateRemark(params) {

        let userId = params.UserId;
        let remark = params.Remark;
        let userInfo = this.state.userInfo;
        if (userInfo["UserId"] == userId) {
            userInfo["Remarks"] = remark;
            this.setState({userInfo: userInfo});
        }
    }

    browseBigHeader() {
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        let param = {};
        let userId = this.state.userInfo["UserId"];
        param["UserId"] = userId;
        NativeModules.QimRNBModule.browseBigHeader(param, function (responce) {
        }.bind(this));
    }

    openMyMedal() {
        let params = {};
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return
        }
        params["userId"] = this.state.userInfo["UserId"];
        params["NativeName"] = "MyMedal";
        NativeModules.QimRNBModule.openNativePage(params);
    }

    openRemarkSetting() {
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        this.props.navigation.navigate('RemarkSetting', {
            'userId': this.state.userInfo["UserId"],
            "name": this.state.userInfo["Name"],
            'remark': this.state.userInfo["Remarks"]
        });
    }

    openUserMedal() {
        if (this.state.userInfo['UserId'] == '' || this.state.userInfo['UserId'] == null) {
            return;
        }
        let userName = this.state.userInfo["Name"];
        let userRemark = this.state.userInfo["Remarks"];
        this.props.navigation.navigate('UserMedal', {
            'userId': this.state.userInfo["UserId"],
            "name": (userRemark == "") ? userName : userRemark,
            'userMedals': this.state.userMedal,
        });
    }


    openUserWorkWorld() {
        let param = {};
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return
        }
        param["UserId"] = this.state.userInfo["UserId"];
        NativeModules.QimRNBModule.openUserWorkWorld(param);
    }

    //打开用户名片
    openUserCard() {
        let params = {};
        if (this.state.userLead === null ||
            this.state.userLead["LeaderId"] === '' || this.state.userLead["LeaderId"] === null ||
            this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return
        }
        let nextUserId = this.state.userLead["LeaderId"];
        if (!nextUserId.indexOf('@')) {
            nextUserId = nextUserId + "@" + AppConfig.getDomain();
        }


        let currentUserId = this.state.userInfo["UserId"];
        //区别总裁办Leader仍是自己
        if (currentUserId !== nextUserId && nextUserId.length) {

            // this.state.userId = nextUserId;
            // this.loadSource();
            this.props.navigation.navigate('UserCard', {
                'UserId': nextUserId,
                'innerVC': true,
            });

            //不移除监听 会导致前一个页面被刷新
            if (this.subscription) {
                this.subscription.remove();
            }
            if (this.refreshNick) {
                this.refreshNick.remove();
            }
        }
    }

    openUserChat() {
        let param = {};
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return
        }
        param["UserId"] = this.state.userInfo["UserId"];
        param["Name"] = this.state.userInfo["Name"];
        NativeModules.QimRNBModule.openUserChat(param);
    }

    //添加好友
    addUserFriend() {
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        let param = {};
        param["UserId"] = this.state.userInfo["UserId"];
        NativeModules.QimRNBModule.addUserFriend(param);
    }

    //删除好友
    rndeleteUserFriend() {
        // let param = {};
        // param["UserId"] = this.state.userInfo["UserId"];
        // NativeModules.QimRNBModule.deleteUserFriend(param);


        Alert.alert(
            I18n.t('Reminder'),
            I18n.t('delete_friend_confirm'),
            [
                {text: I18n.t('Cancel'), onPress: this._cancel},
                {text: I18n.t('Ok'), onPress: this._deleteUserFriend.bind(this)},
            ],
            {cancelable: false}
        )


    }

    _cancel() {

    }

    _deleteUserFriend() {
        let param = {};
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        param["UserId"] = this.state.userInfo["UserId"];
        NativeModules.QimRNBModule.deleteUserFriend(param);
        let moduleName = "UserCard";
        if (Platform.OS === 'ios') {
            AppConfig.exitApp(moduleName);
        } else {
            BackHandler.exitApp();
        }
    }

    showUserPhoneNumber() {
        let param = {};
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        param["UserId"] = this.state.userInfo["UserId"];
        NativeModules.QimRNBModule.showUserPhoneNumber(param);
    }

    //评论
    commentUser() {
        let param = {};
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        param["UserId"] = this.state.userInfo["UserId"];
        NativeModules.QimRNBModule.commentUser(param);
    }

    //发送邮件
    sendMail() {
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        let param = {};
        param["UserId"] = this.state.userInfo["UserId"];
        NativeModules.QimRNBModule.sendEmail(param);
    }

    _showCommentAndEmail() {
        if (!AppConfig.notNeedShowEmailInfo()) {
            if (Platform.OS == 'ios') {
                return (
                    <View style={styles.otherInfo}>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.sendMail();

                        }}>
                            <Text style={styles.cellTitle}>{I18n.t('singlechat_Send_Email')}</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>);
            } else {
                return (
                    <View style={styles.androidOtherInfo}>

                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.sendMail();

                        }}>
                            <Text style={styles.cellTitle}>{I18n.t('singlechat_Send_Email')}</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                );

            }
        }
    }


    _isShowWorkWorld() {

        if (this.state.isShowWrokWorldB) {

            return (
                <View>
                    <View style={styles.line}>
                    </View>
                    <View style={styles.androidOtherInfo}>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openUserWorkWorld();

                        }}>


                            <Text style={styles.cellTitle}>{I18n.t('Moment')}</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>


                        </TouchableOpacity>
                    </View>

                </View>
            );
        }
    }

    _showLeader() {

        let leader = "";
        let leaderId = "";
        let empno = "";
        if (!AppConfig.notNeedShowLeaderInfo() && !AppConfig.notNeedShowMobileInfo()) {
            if (this.state.userLead != null) {
                leader = this.state.userLead["Leader"];
                leaderId = this.state.userLead["LeaderId"];
                empno = this.state.userLead["Empno"];
            }
            return (
                <View style={styles.workInfo}>
                    <View style={styles.cellContentView}>
                        <Text style={styles.cellTitle}>{I18n.t('singlechat_Direct_Supervisor')}</Text>
                        <Text style={styles.cellValue} onPress={() => {
                            this.openUserCard();
                        }}>{leader}</Text>
                    </View>
                    {this._renderLineView()}
                    <View style={styles.cellContentView}>
                        <Text style={styles.cellTitle}>{I18n.t('singlechat_Employee_Number')}</Text>
                        <Text style={styles.cellValue}>{empno}</Text>
                    </View>
                    {this._renderLineView()}
                    <View style={styles.cellContentView}>
                        <Text style={styles.cellTitle}>{I18n.t('singlechat_Mobile_Number')}</Text>
                        <Text style={styles.phoneValue} onPress={() => {
                            console.log("点击查看手机号");
                            this.showUserPhoneNumber();
                        }}>{I18n.t('singlechat_click_view')}</Text>
                    </View>
                </View>

            );
        } else if (!AppConfig.notNeedShowLeaderInfo()) {
            return (
                <View style={styles.workInfo}>
                    <View style={styles.cellContentView}>
                        <Text style={styles.cellTitle}>{I18n.t('singlechat_Direct_Supervisor')}</Text>
                        <Text style={styles.cellValue} onPress={() => {
                            this.openUserCard();
                        }}>{leader}</Text>
                    </View>
                    {this._renderLineView()}
                    <View style={styles.cellContentView}>
                        <Text style={styles.cellTitle}>{I18n.t('singlechat_Employee_Number')}</Text>
                        <Text style={styles.cellValue}>{empno}</Text>
                    </View>
                </View>

            );
        } else if (!AppConfig.notNeedShowMobileInfo()) {
            return (
                <View style={styles.workInfo}>
                    <View style={styles.cellContentView}>
                        <Text style={styles.cellTitle}>{I18n.t('singlechat_Mobile_Number')}</Text>
                        <Text style={styles.phoneValue} onPress={() => {
                            console.log("点击查看手机号");
                            this.showUserPhoneNumber();
                        }}>点击查看</Text>
                    </View>
                </View>

            );
        }
    }

    _renderUserMedal = (info) => {
        let url = info.item.url;
        return (
            <View style={styles.userMealIconContentView}>
                <Image
                    source={{uri: url}}
                    style={styles.userMealIcon}
                />
            </View>
        );
    }

    _renderLineView() {
        return (
            <View style={styles.lineBaseView}>
                <View style={styles.lineView}></View>
            </View>
        )
    }

    _showUserMedal() {
        if (this.state.userMedal == null || this.state.userMedal.length <= 0) {
            return;
        } else {
            return (
                <View>
                    <TouchableOpacity style={styles.remarks} onPress={this.openUserMedal.bind(this)}>
                        <View style={styles.cellContentView}>
                            <Text style={styles.userMedalCellTitle}>{I18n.t('Medals')}</Text>


                            <FlatList
                                style={styles.userMealIconContentView}
                                data={this.state.userMedal}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderUserMedal}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            />
                            <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.line}>

                    </View>
                </View>
            )
        }
    }

    _showDepartment(userId, department) {
        if (AppConfig.isQtalk()) {
            return (
                <View>
                    <View style={styles.baseInfo}>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>{I18n.t('singlechat_UserId')}</Text>
                            <Text
                                style={styles.cellValue}>{this.state.userInfo ? this.state.userInfo["UserId"] : userId}</Text>
                        </View>
                        {/*{this._renderLineView()}*/}
                        {/*<View style={styles.cellContentView}>*/}
                        {/*    <Text style={styles.cellTitle}>{I18n.t('singlechat_Department')}</Text>*/}
                        {/*    <Text*/}
                        {/*        style={styles.cellValue}>{this.state.userInfo ? this.state.userInfo["Department"] : department}</Text>*/}
                        {/*</View>*/}
                    </View>

                    <View style={styles.line}>

                    </View>
                </View>
            );
        }
    }

    _showBottomTabBar() {
        let isFriendBOOL = this.state.isFriend;
        // console.log("isFriendBOOL = " + this.state.isFriend);
        let friendText = isFriendBOOL == true ? I18n.t('singlechat_Delete_Friend') : I18n.t('singlechat_Add_Friend');
        let friendStyle = isFriendBOOL == true ? styles.deleteFriendBtn : styles.addFriendBtn;
        let friendTextColor = isFriendBOOL == true ? "#FFF" : "#333333";
        if (AppConfig.notNeedShowFriendBtn()) {
            return (
                <View>
                    <View style={styles.tabBar}>
                        <View style={styles.wholeTab}>

                            <TouchableOpacity style={styles.sendMessageBtn} onPress={() => {
                                this.openUserChat();
                            }}>
                                <Text style={{color: "#FFF", fontSize: 16}}>
                                    {I18n.t('singlechat_Messages')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={styles.tabBar}>
                        <View style={styles.leftTab}>

                            <TouchableOpacity style={friendStyle} onPress={() => {
                                isFriendBOOL == true ? this.rndeleteUserFriend() : this.addUserFriend();
                            }}>
                                <Text style={{color: friendTextColor, fontSize: 16}}>
                                    {friendText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rightTab}>
                            <TouchableOpacity style={styles.sendMessageBtn} onPress={() => {
                                this.openUserChat();
                            }}>
                                <Text style={{color: "#FFF", fontSize: 16}}>
                                    {I18n.t('singlechat_Messages')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
    }

    _renderUserMedalView() {
        if (AppConfig.isQtalk()) {
            return (<TouchableOpacity style={[styles.remarks,]}
                                      onPress={this.openMyMedal.bind(this)}>
                    <View style={styles.cellContentView}>
                        <Text style={styles.cellTitle}>{I18n.t('Medals')}</Text>
                        <View style={styles.cellValueRow}>
                            {this._getMedalListView()}
                        </View>
                        <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    renderSex() {
        if (Platform.OS == "ios") {
            let sex = 0;
            if (this.state.userInfo) {
                sex = this.state.userInfo["Sex"];
            }
            if (sex == 1) {
                return (
                    <Text style={[styles.sexIconView, {color: '#5DC8FF'}]}>  {String.fromCharCode(0xe928)}</Text>
                )
            } else if (sex == 2) {
                return (
                    <Text style={[styles.sexIconView, {color: '#ff322a'}]}>  {String.fromCharCode(0xe928)}</Text>
                )
            } else {
                return (
                    <Text style={[styles.sexIconView]}></Text>
                )
            }
        }
    }

    render() {
        let nickName = "";
        let mood = ""; //'/Users/admin/Documents/big_image.gif'
        let headerUri = "../images/singleHeaderDefault.png";
        let remark = "设置备注";
        let userId = "";
        let department = "";

        if (this.state.userInfo) {
            // console.log("******************");
            // console.log(this.state.userInfo);
            nickName = this.state.userInfo["Name"];
            headerUri = this.state.userInfo["HeaderUri"];

            remark = this.state.userInfo["Remarks"];
            userId = this.state.userInfo["UserId"];
            department = this.state.userInfo["Department"];

        }
        if (this.state.userMood) {
            mood = this.state.userMood["Mood"];
        }

        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.userHeader}>
                        <TouchableOpacity onPress={this.browseBigHeader.bind(this)}>
                            <Image source={{uri: this.state.userInfo ? this.state.userInfo["HeaderUri"] : headerUri}}
                                   style={styles.userHeaderImage}/>
                        </TouchableOpacity>
                        <View style={styles.userNameInfo}>
                            <Text style={styles.userName}>
                                {this.state.userInfo ? this.state.userInfo["Name"] : nickName}
                                {this.renderSex()}
                            </Text>
                            <Text numberOfLines={2}
                                  style={styles.userMood}>{this.state.userMood ? this.state.userMood["Mood"] : mood}</Text>
                        </View>
                    </View>
                    <View style={styles.line}/>
                    <TouchableOpacity style={styles.remarks} onPress={this.openRemarkSetting.bind(this)}>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>{I18n.t('singlechat_alias')}</Text>
                            <Text
                                style={styles.cellValue}>{this.state.userInfo ? this.state.userInfo["Remarks"] : remark}</Text>
                            <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>
                        </View>
                    </TouchableOpacity>
                    {this._renderLineView()}
                    {this._renderUserMedalView()}
                    <View style={styles.line}>

                    </View>

                    {/*{this._showUserMedal()}*/}

                    {this._showDepartment(userId, department)}
                    {this._showLeader()}

                    {this._isShowWorkWorld()}
                    {this._renderLineView()}
                    {/*<View style={styles.line}>*/}
                    {/*</View>*/}
                    {this._showCommentAndEmail()}

                </ScrollView>
                {this._showBottomTabBar()}

            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    tabBar: {
        height:60,
        flexDirection: "row",
        alignItems:'center',
        backgroundColor: "#f5f5f5",
    },
    leftTab: {
        flex: 1,
    },
    rightTab: {
        flex: 1,
    },
    wholeTab: {
        flex: 1,
        height:60,
    },
    addFriendBtn: {
        marginLeft: 15,
        marginRight: 7.5,
        height: 45,
        backgroundColor: "#FFF",
        borderWidth: 1,

        borderColor: "#D1D1D1",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteFriendBtn: {
        marginLeft: 15,
        marginRight: 7.5,
        height: 45,
        backgroundColor: "#DE5E53",
        borderWidth: 1,
        borderColor: "#D1D1D1",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    sendMessageBtn: {
        marginLeft: 7.5,
        marginRight: 15,
        height: 45,
        backgroundColor: "#00CABE",
        // borderWidth: 1,
        // borderColor: "#D1D1D1",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    line: {
        height: 10,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        minHeight: 60,
        // borderBottomWidth: 1,
        // borderColor: "#EAEAEA",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
        flex: 1,
    },
    cellTitle: {
        marginLeft: 6,
        width: 80,
        color: "#212121",
        fontSize: 16,
    },
    cellValue: {
        marginTop: 23,
        marginBottom: 23,
        flex: 1,
        textAlign: "right",
        color: "#999999",
        fontSize: 14,
        marginRight: 6,
    },
    cellValueRow: {
        paddingTop:9,
        paddingBottom:15,
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row-reverse',
        textAlign: "right",
        color: "#999999",
    },
    userMedalCellTitle: {
        width: 25,
        color: "#333333",
        fontSize: 12,
    },
    userMealIconContentView: {
        flex: 1,
        marginLeft: 5,
        marginRight: 5,
        height: 30,
        flexDirection: "row",
    },
    userMealIcon: {
        width: 24,
        height: 24,
    },
    phoneValue: {
        flex: 1,
        textAlign: "right",
        color: "#00CABE",
    },
    rightArrow: {
        width: 20,
        height: 20,
    },
    userHeader: {
        height: 102,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#FFF",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#EAEAEA",
    },
    userHeaderImage: {
        width: 67,
        height: 67,
        borderRadius: 34,
        borderColor: "#D1D1D1",
        borderWidth: 1,
        alignContent: 'center',
        marginLeft: 12,
        marginTop: 8,
        marginBottom: 8,

    },
    userNameInfo: {

        flex: 1,
        flexDirection: 'column',
        marginLeft: 15,
        paddingRight: 10,

    },
    userName: {
        marginTop: 5,
        fontSize: 18,
        color: "#333333",
    },
    userMood: {

        marginTop: 5,
        fontSize: 13,
        color: "#999999",
    },
    remarks: {
        minHeight: 60,
    },
    baseInfo: {},
    userDepartment: {},
    workInfo: {},
    empno: {},
    leadership: {},
    mobileNo: {},
    otherInfo: {
        height: 60,
    },
    androidOtherInfo: {
        height: 60,
    },
    comment: {},
    sendMail: {},
    medalListItem: {
        marginTop: 6,
        marginRight: ScreenUtils.scaleSize(8),
        width: ScreenUtils.scaleSize(28),
        height: ScreenUtils.scaleSize(28),
    },
    lineBaseView: {
        backgroundColor: '#FFFFFF',
    },
    lineView: {
        marginLeft: 16,
        marginRight: 16,
        height: 1,
        backgroundColor: '#EEEEEE',
    },
    sexIconView: {
        fontFamily: "QTalk-QChat",
        fontSize: ScreenUtils.setSpText(14),
        color: "#fc3da4",
        marginRight: ScreenUtils.scaleSize(5),
    }
});
