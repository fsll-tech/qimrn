import React, {Component} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    Image,
    InteractionManager,
    TouchableOpacity,
    TextInput,
    View,
    Platform,
    NativeModules,
    DeviceEventEmitter,
    BackHandler,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import QIMCheckBox from '../common/QIMCheckBox';
import LoadingView from "../common/LoadingView";
import AppConfig from "../common/AppConfig";
import I18n from "./../i18n/i18N";

class GroupMemberAddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadImage: this.props.loadImage,
            item: this.props.item,
        };
    }

    setMember(item) {
        this.setState({item: item});
    }

    getDesc(desc){
        if(desc === '' || desc === null){

        }else {
            return <Text style={styles.ckDesc}>{desc}</Text>;
        }
    }

    render() {
        let headerUri = this.state.item["headerUri"];
        if (headerUri) {

        } else {
            headerUri = "http://ww2.sinaimg.cn/bmiddle/b432fab8gw1et7zc799jzj20jg0jgabk.jpg";
        }
        let name = this.state.item["name"];
        let desc = this.state.item["desc"];
        // let xmppId = item["xmppId"];
        let hasInGroup = this.state.item["hasInGroup"];
        if (hasInGroup) {
            this.state.item.selected = true;
        } else {

        }
        if (this.state.loadImage || this.state.item.friend) {
            if (hasInGroup) {
                return (
                    <View style={styles.cellContentView}>
                        <QIMCheckBox style={styles.ckBox} size={24} checked={this.state.item.selected}/>
                        <Image source={{uri: headerUri}} style={styles.memberHeader}/>
                        <Text style={styles.ckText}>{name}</Text>
                        <Text style={styles.memberHasInGroup}>{I18n.t('user_in_group')}</Text>
                    </View>
                );
            } else {
                return (
                    <View style={styles.cellContentView}>
                        <QIMCheckBox style={styles.ckBox} size={24} checked={this.state.item.selected}
                                     disabled={hasInGroup}
                                     onValueChange={this.props.onSelectedChange}/>
                        <Image source={{uri: headerUri}} style={styles.memberHeader}/>
                        <View style={{flex:1,flexDirection:'column'}}>
                            <Text style={styles.ckText}>{name}</Text>
                            {this.getDesc(desc)}
                        </View>
                    </View>
                );
            }
        } else {
            if (hasInGroup) {
                return (
                    <View style={styles.cellContentView}>
                        <Text style={styles.ckText}>{name}</Text>
                        <QIMCheckBox style={styles.ckBox} size={24} checked={this.state.item.selected}/>
                        <Text style={styles.memberHasInGroup}>{I18n.t('user_in_group')}</Text>
                    </View>
                );
            } else {
                return (
                    <View style={styles.cellContentView}>
                        <View style={{flex:1,flexDirection:'column'}}>
                            <Text style={styles.ckText}>{name}</Text>
                            {this.getDesc(desc)}
                        </View>
                        <QIMCheckBox style={styles.ckBox} size={24} checked={this.state.item.selected}
                                     disabled={hasInGroup}
                                     onValueChange={this.props.onSelectedChange}/>
                    </View>
                );
            }
        }
    }
}

class GroupAddMemberList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }

    _keyRowExtractor = (item) => {
        return item.xmppId;
    };

    releadData(data) {
        this.setState({data: data});
    }

    _renderRowItem = ({item, index}) => {
        console.log(item);
        // let userDic = this.selectUsers[item];
        let headerUri = item.headerUri;
        let name = item.name;
        let xmppId = item.xmppId;
        let hasInGroup = item.hasInGroup;
        if (hasInGroup) {
            return (
                <View key={this.props.id + index} style={{
                    width: 46 + this.cap,
                    height: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 10
                }}>
                    <TouchableOpacity style={styles.memberHeaderBtn}
                                      disabled={hasInGroup}
                                      onPress={() => {
                                          this.props.onItemClick(item);
                                      }}>
                        <Image source={{uri: headerUri}} style={styles.memberHeaderRow}/>
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={styles.memberNameRow}>{name}</Text>
                </View>
            );
        } else {
            return (
                <View key={this.props.id + index} style={{
                    width: 46 + this.cap,
                    height: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 10
                }}>
                    <TouchableOpacity style={styles.memberHeaderBtn}
                                      onPress={() => {
                                          this.props.onItemClick(item);
                                      }}>
                        <Image source={{uri: headerUri}} style={styles.memberHeaderRow}/>
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={styles.memberNameRow}>{name}</Text>

                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.selectBrowse}>
                <FlatList
                    horizontal={true}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={this._keyRowExtractor}
                    renderItem={this._renderRowItem}/>

            </View>
        );
    }
}

export default class GroupMemberAdd extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('groupmember');
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>{I18n.t('Ok')}</NavCBtn>);
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
            groupMembers: [],
            searchList: [],
            selectUserList: [],
            //for android share or transfer start
            isShare: this.props.navigation.state.params.isFromShare,
            shareMsg: this.props.navigation.state.params.ShareData,
            isTrans: this.props.navigation.state.params.sel_trans_user,
            transMsg: this.props.navigation.state.params.trans_msg,
            //for android share or transfer end
        };
        this.groupId = this.props.navigation.state.params.GroupId;
        this.index = 0;
        this.unMount = false;
        let newUser = this.props.navigation.state.params.newSelectUsers;
        this.selectUsers = newUser ? newUser : {};
        console.log('<================>');
        console.log(this.selectUsers);
        this.selectCellDic = {};
    }

    componentDidMount() {
        // let groupMembers = this.props.navigation.state.params.groupMembers;
        // let memberList = [];
        // if (groupMembers == null) {
        //     return;
        // }
        // for (let index = 0, len = groupMembers.length; index < len; index++) {
        //     memberList.push({"key": "" + (index + 1), "member": groupMembers[index]});
        // }x
        this.setState({loadImage: false});
        InteractionManager.runAfterInteractions(() => {
            this.setState({loadImage: true});
        });

        this.props.navigation.setParams({
            onSavePress: this.onAddMembers.bind(this),
        });

        this.exit = DeviceEventEmitter.addListener('closeAddMembers', function (params) {
            this.closeActivity(params);
        }.bind(this));

        //先展示好友
        this.selectFriends();
    }

    closeActivity(params) {
        let isCreateMuc = params["createMuc"];
        if (isCreateMuc) {
            //关闭activi
            if (Platform.OS === 'ios') {
                AppConfig.exitApp(moduleName);
            } else {
                BackHandler.exitApp();
            }
        }
    }

    //添加群成员
    onAddMembers() {

        LoadingView.show('正在加载');
        let params = {};
        let groupid = this.groupId ? this.groupId : 'none';
        let isGroup = this.groupId ? true : false;
        params['groupId'] = groupid;
        params['members'] = this.selectUsers;
        params['isGroup'] = isGroup;

        //for android transfer or share
        params["isFromShare"] = this.state.isShare;
        params["ShareData"] = this.state.shareMsg;
        params["sel_trans_user"] = this.state.isTrans;
        params["trans_msg"] = this.state.transMsg;
        NativeModules.QimRNBModule.addGroupMember(params, function (response) {

        }.bind(this));


    }

    componentWillUnmount() {
        this.unMount = true;
        this.exit.remove();
    }

    openUserCard(xmppJid) {
        if (xmppJid === '' || xmppJid === null) {
            return;
        }
        this.props.navigation.navigate('UserCard', {
            'userId': xmppJid,
            'innerVC': true,
        });
    }

    isShowUserSelected(index) {
        let itemDic = this.state.searchList[index];
        if (itemDic == null || itemDic == '') {
            return;
        }
        if (this.selectUsers[itemDic.xmppId]) {
            itemDic.selected = false;
            delete this.selectUsers[itemDic.xmppId];
        } else {
            itemDic.selected = true;
            this.selectUsers[itemDic.xmppId] = itemDic;
        }
        this.state.searchList[index] = itemDic;
        // 只刷新List Item
        this.selectCellDic[itemDic.xmppId].setMember(itemDic);
        let selectedUserIDs = [];
        for (let key in this.selectUsers) {
            selectedUserIDs.push(this.selectUsers[key]);
        }
        // 只刷新选择列表
        this.addMemberList.releadData(selectedUserIDs);
        // this.setState({refresh: true});
        // ckBox.props.value = !ckBox.props.value;
    }

    checkHeaderUri() {
        if (Platform.OS == 'ios') {
            return (
                <Image source={{uri: "singleHeaderDefault"}} style={styles.memberHeader}/>
            );
        } else if (Platform.OS == 'android') {
            return (
                <Image source={{uri: "http://ww2.sinaimg.cn/bmiddle/b432fab8gw1et7zc799jzj20jg0jgabk.jpg"}}
                       style={styles.memberHeader}/>
            );
        }
    }

    _keyExtractor = (item) => {
        // console.log(item);
        return item.xmppId + ':' + (item['selected'] ? 'true' : 'false');
    };

    _renderItem = ({item, index}) => {
        // console.log(index);
        //  console.log(item);
        item.selected = this.selectUsers[item.xmppId] ? true : false;
        let hasInGroup = item.hasInGroup;
        return (
            <TouchableOpacity key={item.xmppId} disabled={hasInGroup} style={styles.cellContentView} onPress={() => {
                this.isShowUserSelected(index);
            }}>
                <GroupMemberAddItem ref={(cellItem) => {
                    this.selectCellDic[item.xmppId] = cellItem;
                }} loadImage={this.state.loadImage} item={item} onSelectedChange={() => {
                    this.isShowUserSelected(index);
                }}/>
            </TouchableOpacity>
        );
        // let headerUri = item["headerUri"];
        // if (headerUri) {
        //
        // } else {
        //     headerUri = "http://ww2.sinaimg.cn/bmiddle/b432fab8gw1et7zc799jzj20jg0jgabk.jpg";
        // }
        // let name = item["name"];
        // // let xmppId = item["xmppId"];
        // if (this.state.loadImage) {
        //     return (
        //         <TouchableOpacity key={item.xmppId} style={styles.cellContentView} onPress={() => {
        //
        //             // let ckBox = this.ckList[xmppId];
        //             // ckBox.checked = true;
        //             this.isShowUserSelected(index);
        //         }}>
        //             <Image source={{uri: headerUri}} style={styles.memberHeader}/>
        //             <Text>{name}</Text>
        //             <CheckBox value={this.selectUsers[item.xmppId]}/>
        //
        //         </TouchableOpacity>
        //     );
        // } else {
        //     return (
        //         <TouchableOpacity key={item.xmppId} style={styles.cellContentView} onPress={() => {
        //             // let ckBox = this.ckList[xmppId];
        //             // ckBox.checked = true;
        //             this.isShowUserSelected(index);
        //         }}>
        //             {this.checkHeaderUri()}
        //             <Text>{name}</Text>
        //             <CheckBox value={this.selectUsers[item.xmppId]}/>
        //         </TouchableOpacity>
        //     );
        // }
    }


    //清除搜索框数据
    clearSerachText() {
        this.refs.searchText.clear();
    }

    selectUserByText(userText) {
        let params = {};
        let groupid = this.groupId ? this.groupId : 'none';

        params['groupId'] = groupid;
        params['searchText'] = userText;
        NativeModules.QimRNBModule.selectUserListByText(params, function (responce) {
            if (responce.ok) {
                let userList = responce.UserList;
                this.selectCellDic = {};
                this.setState({searchList: userList})
            }
        }.bind(this));
    }

    selectFriends() {
        let params = {};
        let groupid = this.groupId ? this.groupId : 'none';

        params['groupId'] = groupid;
        NativeModules.QimRNBModule.selectFriendsForGroupAdd(params, function (responce) {
            if (responce.ok) {
                let userList = responce.UserList;
                this.selectCellDic = {};
                this.setState({searchList: userList})
            }
        }.bind(this));
    }

    checkInterval(userText) {
        if (!(userText.replace(/[\u0391-\uFFE5]/g, "aa").length > 2)) {
            return;
        }
        if (this.checkTime) {
            clearTimeout(this.checkTime)
        }
        this.checkTime = setTimeout(this.selectUserByText.bind(this, userText), 1000)
    }

    render() {
        let selectedUserIDs = [];
        // console.log(this.selectUsers);
        for (let key in this.selectUsers) {
            selectedUserIDs.push(this.selectUsers[key]);
        }
        // console.log(selectedUserIDs);
        return (

            <View style={{flex: 1}}>
                <View style={styles.flex}>
                    <View style={styles.searchHeader}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder={I18n.t('search_name')}
                            returnKeyType="search"
                            autoCorrect={false}
                            autoFocus={true}
                            textAlign="left"
                            underlineColorAndroid={'transparent'}
                            clearButtonMode="while-editing"
                            onChangeText={(userText) => {
                                this.checkInterval(userText);
                            }}
                            // onSubmitEditing={this.searchGroupByText.bind(this)}
                            // value={this.searchText}
                            //Warning clear时候没有回调
                        />
                    </View>
                </View>
                <GroupAddMemberList ref={(list) => {
                    this.addMemberList = list;
                }} data={selectedUserIDs} onItemClick={(item) => {



                        delete this.selectUsers[item.xmppId];
                        item.selected = false;
                        try {
                            this.selectCellDic[item.xmppId].setMember(item);
                        }catch (e){

                        }
                        let selectedUserIDs = [];
                        for (let key in this.selectUsers) {
                            selectedUserIDs.push(this.selectUsers[key]);
                        }
                        this.addMemberList.releadData(selectedUserIDs);

                }}/>
                <View style={styles.line}/>
                <View style={{flex: 1}}>
                    <FlatList
                        style={{flex: 1}}
                        data={this.state.searchList}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    cellContentView: {
        flex: 1,
        height: 60,
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E1E1E1",
        alignItems: "center",
    },
    ckBox: {
        marginLeft: 15,
        marginRight: 15,
    },
    ckText: {
        flex: 1,
        textAlignVertical:'center',
    },
    ckDesc: {
        flex: 1,
        fontSize: 12,
        color:'#00CABE',
    },
    line: {
        height: 1
    },
    selectBrowse: {
        flexDirection: "row",
        height: 90,
        backgroundColor: "#ffffff"
    },
    memberHeader: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginLeft: 15,
        marginRight: 15,
    },
    memberHeaderRow: {
        width: 46,
        height: 46,
        borderRadius: 5,
    },
    memberName: {
        flex: 1,
        fontSize: 16,
        color: "#333333",
    },
    memberNameRow: {
        fontSize: 12,
        color: "#999999",
        width: 46,
        textAlign: "center",
        marginTop: 5,
        height: 16,
    },
    memberHasInGroup: {
        fontSize: 9,
        color: "#999999",
        width: 100,
        textAlign: "right",
        marginTop: 5,
        height: 16,
        marginRight: 10,
        marginBottom: 5,
    },
    container: {
        flexDirection: 'row',   // 水平排布
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
        height: Platform.OS === 'ios' ? 68 : 48,   // 处理iOS状态栏
        backgroundColor: '#54fc8c',
        alignItems: 'center'  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
    },
    memberHeaderBtn: {
        width: 46,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        marginLeft: 5,
    },
    logo: {//图片logo
        height: 24,
        width: 64,
        resizeMode: 'stretch'  // 设置拉伸模式
    },
    searchBox: {//搜索框
        height: 35,
        flexDirection: 'row',   // 水平排布
        flex: 1,
        borderRadius: 3,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
    },
    searchIcon: {//搜索图标
        height: 20,
        width: 20,
        marginLeft: 5,
        resizeMode: 'stretch'
    },
    inputText: {
        backgroundColor: 'transparent',
        flex: 1,
        height: 35,
        lineHeight: 30,
        fontSize: 15,
        padding: 0,
        paddingLeft: 20,
    },
    voiceIcon: {
        marginLeft: 5,
        marginRight: 8,
        width: 15,
        height: 20,
        resizeMode: 'stretch'
    },
    scanIcon: {//搜索图标
        height: 26.7,
        width: 26.7,
        resizeMode: 'stretch'
    },
    iconStyle: {
        color: '#333333',
        fontFamily: 'ops_opsapp',
        fontSize: 15,
        marginRight: 20,
    },
    searchHeader: {
        height: 56,
        backgroundColor: "#e6e7e9",
    },
    searchInput: {
        height: 36,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 9,
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "row",
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: '#ccc',
    }
});