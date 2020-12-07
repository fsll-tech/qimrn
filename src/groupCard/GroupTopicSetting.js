import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    NativeModules,
    DeviceEventEmitter, Alert,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import I18n from "./../i18n/i18N";

export default class GroupTopicSetting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('groupchat_Notice_setup');
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
            groupId:this.props.navigation.state.params.groupId,
            groupTopic:this.props.navigation.state.params.groupTopic,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress:this.onSaveRemark.bind(this),
        });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    onSaveRemark(){
        if (this.state.oldGroupTopic != this.state.groupTopic || this.state.oldGroupTopic != this.groupTopic) {
            let param = {};
            param["GroupId"] = this.state.groupId;
            param["GroupTopic"] = this.state.groupTopic;
            if (Platform.OS === 'ios') {
                param["GroupTopic"] = this.groupTopic;
            }
            NativeModules.QimRNBModule.saveGroupTopic(param,function (response) {
                DeviceEventEmitter.emit("updateGroupTopic",param);
                if (response.ok) {
                    this.props.navigation.goBack();
                } else {
                    Alert.alert(I18n.t('Reminder'), I18n.t('faild_change_group_notice'));
                }
            }.bind(this));
        } else {
            this.props.navigation.goBack();
        }
    }

    modifiedGroupTopic(text) {
        if (Platform.OS === 'ios') {
            this.groupTopic = text;
        } else {
            this.setState({groupTopic:text});
        }
    }

    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps={'always'}>
                <Text>{I18n.t('groupchat_Notice')}：</Text>
                <TextInput
                    style={styles.textInput}
                    multiline={true}
                    placeholder={I18n.t('input')}
                    defaultValue={this.state.groupTopic}
                    onChangeText={(text) => this.modifiedGroupTopic(text)}
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
        backgroundColor: "#f4f4f4",
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
        borderColor: "#b4b4b4",
        paddingLeft: 30,
        paddingRight: 30,
        alignItems: "center",
        flex: 1,
    },
    textInput:{
        flex:1,
        height:350,
        backgroundColor:"#FFF",
        marginTop:10,
        marginLeft:0,
        marginRight:0,
        paddingLeft:15,
        paddingRight:15,
        textAlignVertical:'top'
    }
});