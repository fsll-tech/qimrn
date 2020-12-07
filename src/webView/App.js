import React, {Component} from 'react';
import {
    Platform,
    View, SafeAreaView,
    BackHandler,
    UIManager,
    NativeModules, NativeAppEventEmitter,
} from 'react-native';
// import WebView from './qim_webview';
import checkVersion from "./../conf/AutoUpdateRNBundle";
import {StackNavigator,NavigationActions} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import CommonNav from "../common/CommonNav";
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends Component {
    constructor(props) {
        super(props);

        let route = {name:this.props.Screen?this.props.Screen:"WebView"};
        let initData = {};
        if (route.name == "WebView"){
            initData["Url"] = this.props.Url;
        }
        this.AppStack = StackNavigator({
            // 浏览器
            // 'WebView': {
            //     screen: WebView,
            // },
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
            navigationOptions: CommonNav.commonNavigationOptions(),
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
                // console.log("WebView QIM_RN_Check_Version");
                checkVersion.autoCheckRNVersion();
            }
        );
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <this.AppStack {...this.props}/>
            </SafeAreaView>
        )
    }
}