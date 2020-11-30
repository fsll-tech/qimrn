package com.oqimrn;

import android.app.Application;
import android.graphics.Typeface;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

//  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
//    @Override
//    public boolean getUseDeveloperSupport() {
//      return BuildConfig.DEBUG;
//    }
//
//    @Override
//    protected List<ReactPackage> getPackages() {
//      return Arrays.<ReactPackage>asList(
//          new MainReactPackage(),
//            new RNI18nPackage(),
//            new CookieManagerPackage()
//      );
//    }
//  };

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new CookieManagerPackage()
      );
    }

//    @Override
//    protected String getJSMainModuleName() {
//      return "index.android";
//    }
//
//    @Nullable
//    @Override
//    protected String getBundleAssetName() {
//      return "index.android.bundle";
//    }
  };


  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  public static Typeface TypeFaceYaHei;

  @Override
  public void onCreate() {
    super.onCreate();
//    QIMSDK.getInstance().openDebug()


    TypeFaceYaHei = Typeface.createFromAsset(getAssets(), "fonts/DS-Digital.ttf");
    try
    {
      Field field = Typeface.class.getDeclaredField("MONOSPACE");
      field.setAccessible(true);
      field.set(null, TypeFaceYaHei);
    }
    catch (NoSuchFieldException e)
    {
      e.printStackTrace();
    }
    catch (IllegalAccessException e)
    {
      e.printStackTrace();
    }
    SoLoader.init(this, /* native exopackage */ false);
  }
}
