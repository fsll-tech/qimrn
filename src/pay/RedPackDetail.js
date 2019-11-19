/**
 * 红包详情
 **/

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList, Alert, NativeModules,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'

export default class RedPackDetail extends Component{
    static navigationOptions = ({navigation}) => {
        let headerTitle = "红包详细";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Pay"}/>);
        if (navigation.state.params.innerVC) {
            let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
            leftBtn = (<NavCBtn {...props}/>);
        }
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON}  onPress={() => {
            if (navigation.state.params.onSavePress){
                navigation.state.params.onSavePress();
            }
        }}>红包记录</NavCBtn>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
            headerRight: rightBtn,
        };
    };

    constructor(props) {
        super(props);

        this.xmppid = this.props.navigation.state.params.xmppid;//会话id
        this.isChatRoom = this.props.navigation.state.params.isChatRoom;
        this.rid = this.props.navigation.state.params.rid;
        this.state = {
            headerUri:"",
            sender:"",
            content:"",
            type:'',
            credit:'',
            redPackList:[],
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress:this.skipToRedPackRecod.bind(this),
        });

        NativeModules.QimRNBModule.redEnvelopeGet(this.rid,this.xmppid,this.isChatRoom,function (response) {
            if (response.ok) {
                this.setState({
                    headerUri:response.user_img,
                    sender:response.user_name,
                    content:response.red_content,
                    type:response.red_type,
                    credit:response.credit,
                    redPackList:response.redPackList,
                    over_time:response.over_time,
                    red_number:response.red_number,
                });
            } else {
                Alert.alert("提示", "获取红包详情失败");
            }
        }.bind(this));
    }


    componentWillUnmount() {
    }

    //红包记录
    skipToRedPackRecod() {
        this.props.navigation.navigate('RedPackRecod', {
            'innerVC': true,
        });
    }

    _renderItem = ({item,index}) => {
        return <View style={{flex:1,flexDirection:'row'}}>
            <Image style={styles.itemHeader} source={{uri: item.HeaderUri}}/>
            <View style={{marginLeft:15,justifyContent:'center',alignItems:'flex-start'}}>
                <Text style={{fontSize:16,color:'#333333',alignItems:'flex-start'}}>{item.Name}</Text>
                <Text style={{fontSize:13,color:'#999999',marginTop:10,}}>{item.Time}</Text>
            </View>

            <View style={{flex:1,marginRight:15,justifyContent:'center',alignItems:'flex-end'}}>
                <Text style={{fontSize:16,color:'#333333'}}>{item.Credit}元</Text>
                <Text style={{fontSize:13,color:'#E1604C',marginTop:10}}>{item.Rank}</Text>
            </View>
        </View>

    };

    _footer = () => {
        return <View></View>;
    }

    _separator = () => {
        return <View style={{height:0.5,backgroundColor:'#ccc'}}/>;
    }

    showRedPackType(){
        if("lucky" == this.state.type){
            return <Text style={styles.type}>拼</Text>;
        }
    }

    showOverTime(number,time){
        if(time > 0){
            return <Text style={{fontSize:12,color:'#999999',margin:10}}>{number}个红包共{this.state.credit}元，{time}秒被抢光</Text>;
        }else {
            return <Text style={{fontSize:12,color:'#999999',margin:10}}>{number}个红包共{this.state.credit}元</Text>;
        }
    }

    render(){
        return (
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <Image source={{uri: this.state.headerUri}} style={styles.sendPackHeader}/>
                    <View style={{flexDirection:'row',alignItems:'center', marginTop:20,}}>
                        <Text style={styles.packSender}>{this.state.sender} 的红包</Text>
                        {this.showRedPackType()}
                    </View>
                    <Text style={{fontSize:16,color:'#999999',alignItems:'center',marginTop:15}}>{this.state.content}</Text>
                    <Text style={{fontSize:50,color:'#E1604C',alignItems:'center',marginTop:20}}>{this.state.credit}</Text>
                </View>

                <View style={styles.packListInfo}>
                    {this.showOverTime(this.state.red_number,this.state.over_time)}
                    <FlatList
                        ref={(ref)=>this._flatList = ref}
                        ListFooterComponent={this._footer}
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem}
                        refreshing={false}
                        data={this.state.redPackList}>
                    </FlatList>
                </View>
            </View>
        );
    }


}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection:'column',//默认垂直
    },

    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor:'#FCF9ED',
        paddingBottom:25,
    },

    packSender: {
        fontSize:20,
        color:'#212121',
    },
    packListInfo: {
        flex:1,
        backgroundColor:'#FFFFFF',
    },
    sendPackHeader:{
        width: 60,
        height: 60,
        marginTop:40,
        borderRadius: 30,
        alignItems: "center",//次轴方向水平
    },
    itemHeader: {
        width: 40,
        height: 40,
        marginLeft:10,
        marginTop:10,
        marginBottom:10,
        borderRadius: 20,
        alignItems: "center",//次轴方向水平
    },
    type:{
        fontSize:10,
        color:'#ffffff',
        padding:3,
        backgroundColor:'#EF9035',
        marginLeft:5,
        borderRadius: 3,
    }

});