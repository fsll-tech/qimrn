import
    React, {
    Component
}
    from
        'react';
import {
    View,
    Image,
    Text,
    ListView,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Platform,
    ScrollView,
    Alert, NativeAppEventEmitter,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";
import I18n from "./../i18n/i18N";

export default class ServiceState extends Component {
    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('My_Setting_Service_Status');
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        // let leftBtn = (<NavCBtn btnType={NavCBtn.BACK_BUTTON} moduleName={"Setting"}/>);
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
        this.ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 != r2});
        this.state = {
            JsonData: this.ds,
            SeatArray:[],
        }
    }

    componentWillUnmount(){

    }

    componentDidMount() {
        NativeModules.QimRNBModule.getServiceState(function (response) {
            this.setState({
                JsonData:this.ds.cloneWithRows(response.JsonData),
                SeatArray:response.JsonData,
            });
        }.bind(this));
    }


    render(){
        return(
            <View style={styles.wrapper}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.JsonData}
                    renderRow={this.renderRow.bind(this)}
                    style={styles.list}>
                </ListView>

            </View>
        );
    }

    _showImage(flag){
        if(flag){
            return (

            <Image source={require('../images/selected_icon.png')} style={styles.rightArrow}></Image>
            );
        }
    }

    _settingServiceState(state,rowData,rowId){
        if(state !== rowData.st){
            let params = {}
            params['sid'] = rowData.sid;
            params['state'] = state;
            NativeModules.QimRNBModule.setServiceState(params,function (response) {
                if(response.result){
                    this.state.SeatArray[rowId].st = state;
                    this.setState({
                        JsonData:this.ds.cloneWithRows(this.state.SeatArray)
                    });;
                }else{
                    alert(I18n.t('setupFaild'));
                }
            }.bind(this));
        }
    }

    // 返回一个Item
    renderRow(rowData,sectionId,rowId){
        return(
            <View style={styles.wrapper_row}>
                <View style={styles.shopRow}>
                    <Text style={styles.cellTitle}>{I18n.t('Store_Name')}：</Text>
                    <Text style={styles.cellTitleValue}>{rowData.sname}</Text>
                </View>

                    <TouchableOpacity style={styles.selectRow} onPress={() => {
                        this._settingServiceState('0',rowData,rowId);
                    }}>
                        <Text style={styles.cellContent}>{I18n.t('Standard_Mode')}</Text>
                        <Text style={styles.cellContentValue}>{I18n.t('Standard_Mode_Detail')}</Text>
                        {this._showImage('0' == rowData.st)}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.selectRow} onPress={() => {
                        this._settingServiceState('4',rowData,rowId);
                    }}>
                        <Text style={styles.cellContent}>{I18n.t('Super_Mode')}</Text>
                        <Text style={styles.cellContentValue}>{I18n.t('Super_Mode_Detail')}</Text>
                        {this._showImage('4' == rowData.st)}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.selectRow} onPress={() => {
                        this._settingServiceState('1',rowData,rowId);
                    }}>
                        <Text style={styles.cellContent}>{I18n.t('Snooze_Mode')}</Text>
                        <Text style={styles.cellContentValue}>{I18n.t('Snooze_Mode_Detail')}</Text>
                        {this._showImage('1' == rowData.st)}
                    </TouchableOpacity>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    wrapper_row: {
        height:210,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    cellTitle: {
        color: "#999999",
        fontSize: 13,
    },
    cellTitleValue: {
        flex:1,
        color: "#999999",
        fontSize: 13,
    },
    cellContent: {
        width:100,
        color: "#000000",
        fontSize: 14,
    },
    cellContentValue: {
        flex:1,
        color: "#999999",
        textAlign: "left",
        fontSize: 14,
    },
    list: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: -7,
    },
    selectRow:{
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 50,
        borderBottomWidth: 1,
        borderColor: "#eaeaea",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
        flex: 1,
    },
    shopRow:{
        flexDirection: "row",
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom:5,
        alignItems: "flex-end",
        flex: 1,
    }

});