import React, {Component} from 'react';
import {
    Image,
    View,
    Text,
    StyleSheet,
    NativeModules,
    InteractionManager,
    Dimensions,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import I18n from "./../i18n/i18N";

const {height, width} = Dimensions.get('window');
export default class UserQRCode extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = I18n.t('My_QRCode');
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        // let leftBtn = (<NavCBtn {...props}/>);
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"MySetting"}/>);
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
            headerRight:<View/>,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            userId:this.props.navigation.state.params.userId,
            userName:this.props.navigation.state.params.userName,
            userHeader:this.props.navigation.state.params.userHeader,
            userQRCode:null,
        }
        this.unMount = false;
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(()=> {
        if(this.state.userId===''||this.state.userId===null){
            return;
        }
        NativeModules.QimRNBModule.getUserQRCode(this.state.userId,function (responce) {
            this.setState({userQRCode:responce.qrCode});
        }.bind(this));
        // });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    qrCodeImage(){
        if (this.state.userQRCode){
            return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Image style={styles.qrCode} source={{uri:this.state.userQRCode}}/></View>);
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.qrCodeContent}>
                    <View style={styles.headerInfo}>
                        <Image style={styles.headerImage} source={{uri: this.state.userHeader}} />
                        <Text style={styles.groupName}>{this.state.userName}</Text>
                    </View>
                    {this.qrCodeImage()}
                </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper:{
        flex:1,
        backgroundColor:"#C1C1C1",
    },
    qrCodeContent:{
        width:300,
        height:360,
        backgroundColor:"#FFF",
        marginTop:80,
        marginLeft:(width-300)/2.0,
    },
    headerInfo:{
        height:50,
        flexDirection:"row",
        marginTop:20,
        alignItems:"center",
    },
    headerImage:{
        width:50,
        height:50,
        borderRadius:5,
        marginLeft:20,
        marginRight:20,
    },
    groupName:{
        fontSize:16,
        color:"#333333",
    },
    qrCode:{
        width:256,
        height:256,
    }
});