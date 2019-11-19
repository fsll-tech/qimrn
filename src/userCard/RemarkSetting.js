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

export default class RemarkSetting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('singlechat_modify_alias');
        // console.log(headerTitle);
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
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
            userId: this.props.navigation.state.params.userId,
            remark: this.props.navigation.state.params.remark,
            name: this.props.navigation.state.params.name,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress: this.onSaveRemark.bind(this),
        });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    onSaveRemark() {
        let parma = {};
        if (this.state.userId === '' || this.state.userId === null) {
            return;
        }
        parma["UserId"] = this.state.userId;
        parma["Remark"] = this.state.remark;
        parma["Name"] = this.state.name;
        if (Platform.OS === 'ios') {
            parma["Remark"] = this.remarkText;
        }
        NativeModules.QimRNBModule.saveRemark(parma, function (responce) {

            if (responce.ok) {
                DeviceEventEmitter.emit("updateRemark", parma);
                this.props.navigation.goBack();
            } else {
                Alert.alert(I18n.t('Reminder'), I18n.t('setupFaild'));
            }


        }.bind(this));
    }

    personalRemarkChangeText(text) {
        if (Platform.OS === 'ios') {
            this.remarkText = text;
        } else {
            this.setState({remark:text});
        }
    }
    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <View style={styles.line}/>
                <View style={styles.remarks}>
                    <View style={styles.cellContentView}>
                        <Text>{I18n.t('singlechat_alias')}：</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={I18n.t('input')}
                            defaultValue={this.state.remark}
                            onChangeText={(text) => this.personalRemarkChangeText(text)}
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
    textInput: {
        flex: 1,
        height: 40,
        backgroundColor: "#FFF",
    }
});