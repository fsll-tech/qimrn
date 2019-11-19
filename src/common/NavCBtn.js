import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    BackHandler,
    Platform,
} from 'react-native';
import AppConfig from "./AppConfig";
import I18n from "./../i18n/i18N";
import SafeAreaView from 'react-native-safe-area-view';

export default class NavCBtn extends Component {

    static EXIT_APP = 1;
    static BACK_BUTTON = 2;
    static WEB_BACK_BUTTON = 3;
    static NAV_BUTTON = 4;

    static exitApp(moduleName) {
        if (Platform.OS === 'ios') {
            AppConfig.exitApp(moduleName);
        } else {
            BackHandler.exitApp();
        }
    }

    exitApp() {
        NavCBtn.exitApp(this.props.moduleName)
    }

    goBack() {
        let success = this.props.navigation.goBack();
        if (success == false) {
            this.exitApp();
        }
    }

    componentDidMount() {
        // if (Platform.OS == 'android') {
        //     BackHandler.addEventListener('hardwareBackPress', this.onBackHandler.bind(this));
        // }
    }

    componentWillUnmount() {
        // if (Platform.OS == 'android') {
        //     BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler.bind(this));
        // }
    }

    // onBackHandler() {
    //     if (this.props.navigation) {
    //         if (this.props.navigation.getCurrentRoutes().length > 1) {
    //             this._navigator.pop();
    //             return true;
    //         } else {
    //             if (Platform.OS == 'android') {
    //                 BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler.bind(this));
    //             }
    //             return false;
    //         }
    //     }
    //     return false;
    // }

    render() {
        if (this.props.btnType == NavCBtn.BACK_BUTTON || this.props.btnType == NavCBtn.EXIT_APP) { // 返回按钮
            let backTitle = I18n.t('common_backButton');
            // if (this.props.navigation && this.props.navigation.state.params&&this.props.navigation.state.params.backTitle){
            //     backTitle = this.props.navigation.state.params.backTitle;
            // }
            return (
                <SafeAreaView>
                    <View style={styles.leftBtnContainer}>
                        <TouchableOpacity
                            onPress={this.props.btnType == NavCBtn.BACK_BUTTON ? this.goBack.bind(this) : this.exitApp.bind(this)}
                            style={styles.backButton}>
                            <Image resizeMode={'contain'}  source={require('../images/new_back.png')}
                                   style={styles.backBtnIcon}/>
                            {/*<Text style={styles.backButtonText}>{backTitle}</Text>*/}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        } else if (this.props.btnType == NavCBtn.WEB_BACK_BUTTON) { // WebView 带后退的返回按钮
            return (
                <SafeAreaView>
                    <View style={styles.leftWebBtnContainer}>
                        <TouchableOpacity
                            onPress={this.props.onPress}
                            style={styles.backButton}>
                            <Image source={require('../images/back_green.png')}
                                   style={styles.backBtnIcon}/>
                            <Text style={styles.buttonText}>{I18n.t('common_backButton')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.exitApp.bind(this)}
                            style={styles.closeBtn}>
                            <Text style={styles.buttonText}>{I18n.t('common_closeButton')}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        } else if (this.props.btnType == NavCBtn.NAV_BUTTON) { // 右侧按钮
            return (
                <SafeAreaView>
                    <View style={styles.rightButtonContainer}>
                        <Text style={styles.rightButtonText}
                              onPress={this.props.onPress}>{this.props.children}</Text>
                    </View>
                </SafeAreaView>
            );
        } else {
            return;
        }
    }
}


const styles = StyleSheet.create({
    leftBtnContainer: {
        flex: 1,
        flexDirection: "row",
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftWebBtnContainer: {
        flex: 1,
        flexDirection: "row",
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButton: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    backBtnIcon: {
        width: 30,
        height: 30,
        marginTop: 1,
        marginLeft: 4,
    },
    closeButton: {
        flex: 1, flexDirection: 'row', width: 30, alignItems: 'center', justifyContent: 'center'
    },
    backButtonText: {
       fontSize: 15, color: '#666666', fontWeight: '400'
    },
    rightButtonText: {
        fontSize: 15, color: '#00CABE', fontWeight: '600'
    },
    rightButtonContainer: {
        marginRight: 10
    }
});