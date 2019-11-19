/* @Flow */
import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Switch,
    Dimensions,
    Alert,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import I18n from "./../i18n/i18N";
import ScreenUtils from "../common/ScreenUtils";

const {height, width} = Dimensions.get('window');

export default class ChatInfo extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('commonchat_Information');
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
        this.state = {
            userId: this.props.navigation.state.params.UserId,
            RealJid: this.props.navigation.state.params.RealJid,
            // name: this.props.navigation.state.params.Name,
            // headerUri: this.props.navigation.state.params.HeaderUri,
            name: null,
            headerUri: null,
            stickyState: false,
            pushState: false,
            showRed:false,
        };
        this.unMount = false;
        this.cap = (width - 46 * 5) / 6.0;
    }

    //页面框架基本完成,请求一些基础数据
    componentDidMount() {
        if (this.state.userId === '' || this.state.userId === null) {
            return;
        }
        let realJid = this.state.RealJid;
        if(realJid === '' || realJid === null){
            realJid = this.state.userId;
        }
        NativeModules.QimRNBModule.getUserInfo(realJid, function (response) {
            let userInfo = response.UserInfo;
            this.setState({
                name: userInfo['Name'],
                headerUri: userInfo['HeaderUri'],
            })
        }.bind(this));
        let params = {};
        if (this.state.RealJid === '' || this.state.RealJid === null) {
            return;
        }
        params['xmppId'] = this.state.userId;
        params['realJid'] = this.state.RealJid;
        NativeModules.QimRNBModule.syncChatStickyState(params, function (response) {
            let state = response.state;
            this.setState({stickyState: state});
        }.bind(this));

        NativeModules.QimRNBModule.syncPushState(this.state.RealJid, function (responce) {
            let state = responce.state;
            this.setState({pushState: state});
        }.bind(this));

        NativeModules.QimRNBModule.showRedView(function (response) {
            this.setState({
                    showRed:response.show,
                }
            )
        }.bind(this))

    }

    componentWillUnmount() {
        this.unMount = true;
        if (this.subscription) {
            this.subscription.remove();
        }
    }

    openUserCard() {
        // let param = {};
        if(this.state.userId===''||this.state.userId===null){
            return;
        }
        let realJid = this.state.RealJid;
        if(realJid === '' || realJid === null){
            realJid = this.state.userId
        }
        // let userId = this.state.userId;
        // param["UserId"] = userId;
        // NativeModules.QimRNBModule.openUserCard(param);

        this.props.navigation.navigate('UserCard', {
            'UserId': realJid,
            'innerVC': true,
        });
    }

    addGroupMember() {
        if (this.state.name === '' || this.state.name === null ||
            this.state.userId === '' || this.state.userId === null) {
            return;
        }
        //打开加人页面
        // newSelectUsers
        let newSelectUsers = {};
        let user = {}
        user['name'] = this.state.name;
        user['xmppId'] = this.state.userId;
        user['headerUri'] = this.state.headerUri;
        newSelectUsers[this.state.userId] = user;

        this.props.navigation.navigate('GroupMemberAdd', {
            'GroupId': this.props.navigation.state.params.groupId,
            'newSelectUsers': newSelectUsers,
        });
    }

    searchChatHistory() {
        // let params = {};
        // params['NativeName'] = 'searchChatHistory';
        // NativeModules.QimRNBModule.openNativePage(params);

        //跳转到搜索
        let realJid = this.state.RealJid;
        if(realJid === '' || realJid === null){
            realJid = this.state.userId;
        }

        let params = {};
        params["Bundle"] = 'clock_in.ios';
        params["Module"] = 'Search';
        params["Properties"] = {};
        params["Properties"]["xmppid"] = this.state.userId;
        params["Properties"]["realjid"] = realJid;
        params["Properties"]["chatType"] = '0';
        params["Properties"]["Screen"] = "LocalSearch";
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });


        NativeModules.QimRNBModule.isShowRedView();
        this.setState({
            showRed:false
        })
    }

    changeChatTop(stickyState2) {
        let params = {};
        if (this.state.name === '' || this.state.name === null ||
            this.state.userId === '' || this.state.userId === null
        ) {
            return;
        }
        params['xmppId'] = this.state.userId;
        params['realJid'] = this.state.RealJid;
        NativeModules.QimRNBModule.updateUserChatStickyState(
            params,
            function (response) {
                if (response.ok) {

                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('commonchat_faild_Sticky_on_Top'));
                    this.setState({stickyState: !stickyState2});
                }
            }.bind(this)
        );
    }

    changeChatPushState(pushState) {
        if(this.state.RealJid===''||this.state.RealJid===null){
            return;
        }
        NativeModules.QimRNBModule.updatePushState(
            this.state.RealJid,
            pushState,
            function (responce) {
                if (responce.ok) {

                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('setupFaild'));
                    this.setState({pushState: !pushState});
                }
            }.bind(this)
        );
    }

    openEncryptedSession() {

    }

    // showRed() {
    //     NativeModules.QimRNBModule.showRedView(function (response) {
    //         if (response.show) {
    //             return (
    //                 <View style={styles.redView}>
    //                     <View style={styles.round}>
    //                     </View>
    //                     <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
    //                 </View>
    //             );
    //         } else {
    //             return (
    //                 <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
    //             );
    //         }
    //     });
    // }

    clearChatMessage() {
        Alert.alert(I18n.t('Reminder'), I18n.t('commonchat_clear_History_confirm'),
            [
                {text: I18n.t('Ok'), onPress: this._clearPressOK.bind(this)},
                {text: I18n.t('Cancel'), onPress: this._clearPressCancel},

            ]
        );
    }

    showRed() {

        if (this.state.showRed) {
            return (
                <View>
                    <TouchableOpacity style={[styles.cellContentView, {justifyContent: 'space-between'}]}
                                      onPress={this.searchChatHistory.bind(this)}>
                        <Text style={styles.cellTitle}>{I18n.t('comonchat_search_History')}</Text>
                        <View style={styles.redView}>
                            <View style={styles.round}>
                            </View>
                            <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>
                        </View>
                    </TouchableOpacity>
                </View>

            );
        } else {
            return (
                <View>
                    <TouchableOpacity style={[styles.cellContentView, {justifyContent: 'space-between'}]}
                                      onPress={this.searchChatHistory.bind(this)}>
                        <Text style={styles.cellTitle}>{I18n.t('comonchat_search_History')}</Text>

                        <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            );
        }

    }

    _clearPressOK(){
        let params ={};
        params['xmppId'] = this.state.userId;
        NativeModules.QimRNBModule.clearImessage( params);
    }

    _clearPressCancel(){

    }

    getHeaderImage(headerUri){
        if (headerUri == null || headerUri == '') {
            return (
                <TouchableOpacity style={styles.headerView} onPress={this.openUserCard.bind(this)}>
                    <Image source={require('../images/single_chat_icon.png')} style={styles.userHeaderImage}/>
                    <View style={styles.userNameView}>
                        <Text style={styles.userName} numberOfLines={1}>{this.state.name}</Text>
                    </View>
                    <Image source={require('../images/new_arrow_right.png')} style={styles.userHeaderArrowView}/>
                </TouchableOpacity>
            );
        }else {
            return (
                <TouchableOpacity style={styles.headerView} onPress={this.openUserCard.bind(this)}>
                    <Image source={{uri:headerUri}} style={styles.userHeaderImage}/>
                    <View style={styles.userNameView}>
                        <Text style={styles.userName} numberOfLines={1}>{this.state.name}</Text>
                    </View>
                    <Image source={require('../images/new_arrow_right.png')} style={styles.userHeaderArrowView}/>
                </TouchableOpacity>
            );
        }
    }

    _renderLineView() {
        return (
            <View style={styles.lineBaseView}>
                <View style={styles.lineView}></View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    {/*<View style={styles.headerView}>*/}
                        {this.getHeaderImage(this.state.headerUri)}
                        {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                        {/*<TouchableOpacity style={styles.addMemberBtn} onPress={() => {*/}
                            {/*this.addGroupMember();*/}
                        {/*}}>*/}
                            {/*<Image source={require('../images/add_member.png')} style={styles.addMemberIcon}/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    {this._renderLineView()}

                    <TouchableOpacity style={[styles.cellContentView, {alignItems: 'center'}]} onPress={() => {
                        this.addGroupMember();
                    }}>
                        <Text style={styles.addMemberIcon}> {String.fromCharCode(0xf298)}</Text>
                        <Text style={styles.addMemberTitle}>{I18n.t('Join_in_Group')}</Text>
                    </TouchableOpacity>

                    <View style={styles.line}/>
                    <View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>{I18n.t('singlechat_Messages_Notification')}</Text>
                            <View style={styles.cellQRCode}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}}
                                        value={this.state.pushState}
                                        onTintColor={'#00CABE'}
                                        onValueChange={(value) => {
                                            this.setState({pushState: value});
                                            this.changeChatPushState(value);
                                        }}/>
                            </View>
                        </View>
                        {this._renderLineView()}
                        <TouchableOpacity style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>{I18n.t('commonchat_Sticky_on_Top')}</Text>
                            <View style={styles.cellQRCode}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}}
                                        value={this.state.stickyState}
                                        onTintColor={'#00CABE'}
                                        onValueChange={(value) => {
                                            this.setState({stickyState: value});
                                            this.changeChatTop(value);
                                        }}/>
                            </View>
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={styles.cellContentView}>*/}
                        {/*<Text style={styles.cellTitle}>加密聊天</Text>*/}
                        {/*<View style={styles.cellQRCode}>*/}
                        {/*<Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}} value={this.state.pushState}*/}
                        {/*onValueChange={(value) => {*/}
                        {/*this.setState({pushState: value});*/}
                        {/*this.openEncryptedSession(value);*/}
                        {/*}}/>*/}
                        {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    <View style={styles.line}/>
                    {/*<View>*/}
                        {/*<TouchableOpacity style={styles.cellContentView} onPress={this.searchChatHistory.bind(this)}>*/}
                            {/*<Text style={styles.cellTitle}>查找聊天内容</Text>*/}

                            {this.showRed()}
                            {/*<Text style={styles.cellValue}></Text>*/}
                            {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    <View>
                        {this._renderLineView()}
                        <TouchableOpacity style={styles.cellContentView} onPress={this.clearChatMessage.bind(this)}>
                            <Text style={styles.cellTitle}>{I18n.t('commonchat_clear_History')}</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/new_arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor:'#f5f5f5',
    },
    tabBar: {
        height: 64,
        flexDirection: "row",
        backgroundColor: "#f5f5f5",
    },
    leftTab: {
        flex: 1,
    },
    rightTab: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    dividingline: {
        flex: 1,
        height: 1,
        backgroundColor: '#ee4b35',
        marginLeft: 16,
        marginRight: 16,
    },
    line: {
        height: 10,
    },
    cellTitle: {
        width: 150,
        fontSize: 16,
        color: "#212121",
        marginLeft: 10,
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
    },
    rightArrow: {
        width: 20,
        height: 20,
        // marginRight: -7,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 60,
        // borderBottomWidth: 1,
        // borderColor: "#EAEAEA",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
        flex: 1,
    },
    cellQRCode: {
        flex: 1,
        alignItems: "flex-end",
    },
    headerView: {
        flex: 1,
        height: 100,
        backgroundColor: "#ffffff",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
    },
    userView: {
        flex: 1,
        marginLeft: 11,
        height: 100,
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: '#ff2447',
    },
    userHeaderImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: "#EEEEEE",
    },
    userNameView: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginLeft: 10,
        marginRight: 30,
    },
    userName: {
        fontSize: 16,
        color: "#212121",
    },
    userHeaderArrowView:  {
        width: 20,
        height: 20,
    },
    addMemberBtn: {
        width: 46,
        height: 46,
        borderColor: "#E1E1E1",
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginLeft: 26,
    },
    addMemberIcon: {
        marginLeft: -5,
        marginTop: 2,
        fontFamily: "QTalk-QChat",
        fontSize: ScreenUtils.setSpText(28),
        color: "#00CABE",
    },
    addMemberTitle: {
        width: 150,
        fontSize: 16,
        color: "#212121",
        marginLeft: 5,
    },
    redView: {

        flexDirection: "row",
        height: 44,
        alignItems: "center",
    },
    round: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'red',
        alignSelf: 'center'
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

});
