import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    NativeModules,
    DeviceEventEmitter,
    Alert,
    Platform,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import I18n from "./../i18n/i18N";

export default class GroupNameSetting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('groupchat_name_setting');
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON}  onPress={() => {
            if (navigation.state.params.onSavePress){
                navigation.state.params.onSavePress();
            }
        }}>{I18n.t('common_saveButton')}</NavCBtn>);
        return {
            headerTitle: headerTitle,
            headerStyle:{
                borderBottomWidth: 0.5,
                elevation: 0,
                borderColor:'#eaeaea',

            },
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
            groupId:this.props.navigation.state.params.groupId,
            groupName:this.props.navigation.state.params.groupName,
            oldGroupName:this.props.navigation.state.params.groupName,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress:this.onSaveGroupName.bind(this),
        });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    onSaveGroupName(){
        if (this.state.oldGroupName != this.state.groupName || this.state.oldGroupName != this.groupName) {
            let parma = {};
            parma["GroupId"] = this.state.groupId;
            parma["GroupName"] = this.state.groupName;
            if(Platform.OS === 'ios') {
                parma["GroupName"] = this.groupName;
            }
            NativeModules.QimRNBModule.saveGroupName(parma,function (response) {
                DeviceEventEmitter.emit("updateGroupName",parma);
                if (response.ok) {
                    this.props.navigation.goBack();
                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('faild_change_group_name'));
                }
            }.bind(this));
        } else {
            this.props.navigation.goBack();
        }
    }

    modifiedGroupName(text) {
        if (Platform.OS === 'ios') {
            this.groupName = text;
        } else {
            this.setState({groupName:text});
            }
        }

    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <View style={styles.line}/>
                <View style={styles.remarks}>
                    <View style={styles.cellContentView}>
                        <Text>{I18n.t('groupchat_name_setting_promot')}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={I18n.t('groupchat_name_setting_placeholder')}
                            defaultValue={this.state.groupName}
                            onChangeText={(text) => this.modifiedGroupName(text)}
                            underlineColorAndroid='transparent'
                            clearButtonMode="while-editing"
                        />
                    </View>
                </View>
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
        // paddingVertical: 20
    },
    remarks: {
        height: 50
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
        height:40,
        alignItems: "center",
        backgroundColor:"#FFF",
    }
});