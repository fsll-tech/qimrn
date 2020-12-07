import React, {Component} from 'react';
import {
    Platform,
    View, SafeAreaView,
    NativeModules,
    BackHandler,
    UIManager, NativeAppEventEmitter,
} from 'react-native';
import ClockIn from './clock_in';
import ClockDetail from './clock_in_detail';
import ClockOn from './clock_on';
import checkVersion from "./../conf/AutoUpdateRNBundle";

import {StackNavigator,NavigationActions} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends Component {
    constructor(props) {
        super(props);

        let route = {name:this.props.Screen?this.props.Screen:"ClockIn"};
        let initData = this.props.data;
        this.AppStack = StackNavigator({
            // 打卡
            'ClockIn': {
                screen: ClockIn,
            },
            //
            'ClockOn': {
                screen: ClockOn,
            },
            //
            'ClockDetail':{
                screen: ClockDetail,
            }
        }, {
            mode:'card',
            headerMode: 'screen',
            cardStyle: { shadowColor: 'transparent', paddingTop: 0, marginTop: 0 },
            headerStyle:{
                borderBottomWidth: 0.5,
                elevation: 0,
                borderColor:'#fbfbfb',
                height: 40,
                backgroundColor: '#ffffff'
            },
            initialRouteName: route.name,
            initialRouteParams: initData,
            transitionConfig: () => ({screenInterpolator: CardStackStyleInterpolator.forHorizontal})
        });

        let stateIndex;
        const defaultGetStateForAction = this.AppStack.router.getStateForAction;
        this.AppStack.router.getStateForAction = (action, state) => {
            if (state) {
                stateIndex = state.index;
                if (action.type === NavigationActions.BACK) {
                    if (stateIndex == 0) {
                        if (Platform.OS === 'ios') {
                            NativeModules.ExitApp.exitApp(() => {}, () => {});
                        } else {
                            BackHandler.exitApp();
                        }
                        return;
                    }
                }
            }
            return defaultGetStateForAction(action, state);
        };
    }

    componentDidMount() {
        this.willShow = NativeAppEventEmitter.addListener(
            'QIM_RN_Check_Version',
            () => {
                // console.log("clock_In QIM_RN_Check_Version");
                checkVersion.autoCheckRNVersion();
            }
        );
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                    <this.AppStack />
                </SafeAreaView>
        )
    }
}